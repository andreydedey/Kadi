package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.category.dto.CategoryDTO;
import com.codewithandrey.kadi.category.dto.CategoryDetailDTO;
import com.codewithandrey.kadi.category.dto.CategoryRequest;
import com.codewithandrey.kadi.category.mapper.CategoryMapper;
import com.codewithandrey.kadi.exception.ForbiddenException;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.transaction.TransactionRepository;
import com.codewithandrey.kadi.transaction.TransactionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private CategoryMapper categoryMapper;
    @Mock
    private UserCategoryLimitRepository userCategoryLimitRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private AuthService authService;

    @InjectMocks
    private CategoryService categoryService;

    private User user;
    private Category standardCategory;
    private Category userCategory;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());

        standardCategory = new Category();
        standardCategory.setId(1L);
        standardCategory.setName("Food");
        standardCategory.setUser(null); // standard category

        userCategory = new Category();
        userCategory.setId(2L);
        userCategory.setName("Custom");
        userCategory.setUser(user); // user-owned category

        when(authService.currentUser()).thenReturn(user);
    }

    @Test
    void list_returnsMappedCategoryDTOs() {
        CategoryDTO dto1 = new CategoryDTO(1L, "Food");
        CategoryDTO dto2 = new CategoryDTO(2L, "Custom");
        when(categoryRepository.findAll()).thenReturn(List.of(standardCategory, userCategory));
        when(categoryMapper.toDTO(standardCategory)).thenReturn(dto1);
        when(categoryMapper.toDTO(userCategory)).thenReturn(dto2);

        List<CategoryDTO> result = categoryService.list();

        assertThat(result).containsExactly(dto1, dto2);
    }

    @Test
    void listDetail_returnsDetailDTOsWithLimitsAndSpent() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        UserCategoryLimit limit = new UserCategoryLimit();
        limit.setCategory(standardCategory);
        limit.setLimit(300L);

        TransactionRepository.CategorySpent categorySpent = new TransactionRepository.CategorySpent() {
            public Long getCategoryId() { return 1L; }
            public Long getTotalSpent() { return 150L; }
        };

        when(userCategoryLimitRepository.findByUser(user)).thenReturn(List.of(limit));
        when(transactionRepository.sumSpentGroupedByCategoryForUser(
                eq(user),
                eq(List.of(TransactionType.EXPENSE, TransactionType.TRANSFER)),
                eq(startOfMonth),
                eq(startOfMonth.plusMonths(1))
        )).thenReturn(List.of(categorySpent));
        when(categoryRepository.findAll()).thenReturn(List.of(standardCategory, userCategory));

        List<CategoryDetailDTO> result = categoryService.listDetail();

        assertThat(result).hasSize(2);

        CategoryDetailDTO food = result.stream().filter(c -> c.id().equals(1L)).findFirst().orElseThrow();
        assertThat(food.name()).isEqualTo("Food");
        assertThat(food.isStandard()).isTrue();
        assertThat(food.globalLimit()).isEqualTo(300L);
        assertThat(food.globalSpent()).isEqualTo(150L);

        CategoryDetailDTO custom = result.stream().filter(c -> c.id().equals(2L)).findFirst().orElseThrow();
        assertThat(custom.isStandard()).isFalse();
        assertThat(custom.globalLimit()).isNull();
        assertThat(custom.globalSpent()).isEqualTo(0L);
    }

    @Test
    void create_savesCategoryWithoutLimit_whenLimitIsNull() {
        CategoryRequest request = new CategoryRequest("New Category", null);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        CategoryDetailDTO result = categoryService.create(request);

        assertThat(result.id()).isEqualTo(10L);
        assertThat(result.name()).isEqualTo("New Category");
        assertThat(result.isStandard()).isFalse();
        assertThat(result.globalLimit()).isNull();
        assertThat(result.globalSpent()).isEqualTo(0L);
        verify(userCategoryLimitRepository, never()).save(any());
    }

    @Test
    void create_savesCategoryAndLimit_whenLimitIsProvided() {
        CategoryRequest request = new CategoryRequest("New Category", 500L);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });
        when(userCategoryLimitRepository.findByUserAndCategory(eq(user), any(Category.class)))
                .thenReturn(Optional.empty());

        CategoryDetailDTO result = categoryService.create(request);

        assertThat(result.globalLimit()).isEqualTo(500L);
        verify(userCategoryLimitRepository).save(any(UserCategoryLimit.class));
    }

    @Test
    void update_throwsResourceNotFoundException_whenCategoryNotFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.update(99L, new CategoryRequest("name", null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found");
    }

    @Test
    void update_throwsForbiddenException_whenUpdatingStandardCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(standardCategory));

        assertThatThrownBy(() -> categoryService.update(1L, new CategoryRequest("name", null)))
                .isInstanceOf(ForbiddenException.class)
                .hasMessage("Standard categories cannot be modified");
    }

    @Test
    void update_updatesNameAndSavesLimit_whenLimitProvided() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        CategoryRequest request = new CategoryRequest("Renamed Custom", 400L);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(userCategory));
        when(userCategoryLimitRepository.findByUserAndCategory(user, userCategory)).thenReturn(Optional.empty());
        when(transactionRepository.sumSpentGroupedByCategoryForUser(
                eq(user),
                eq(List.of(TransactionType.EXPENSE, TransactionType.TRANSFER)),
                eq(startOfMonth),
                eq(startOfMonth.plusMonths(1))
        )).thenReturn(List.of());

        CategoryDetailDTO result = categoryService.update(2L, request);

        assertThat(userCategory.getName()).isEqualTo("Renamed Custom");
        verify(categoryRepository).save(userCategory);
        verify(userCategoryLimitRepository).save(any(UserCategoryLimit.class));
        assertThat(result.globalLimit()).isEqualTo(400L);
        assertThat(result.globalSpent()).isEqualTo(0L);
    }

    @Test
    void update_deletesExistingLimit_whenLimitIsNull() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        UserCategoryLimit existingLimit = new UserCategoryLimit();
        CategoryRequest request = new CategoryRequest("Renamed Custom", null);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(userCategory));
        when(userCategoryLimitRepository.findByUserAndCategory(user, userCategory))
                .thenReturn(Optional.of(existingLimit));
        when(transactionRepository.sumSpentGroupedByCategoryForUser(
                eq(user),
                eq(List.of(TransactionType.EXPENSE, TransactionType.TRANSFER)),
                eq(startOfMonth),
                eq(startOfMonth.plusMonths(1))
        )).thenReturn(List.of());

        categoryService.update(2L, request);

        verify(userCategoryLimitRepository).delete(existingLimit);
    }

    @Test
    void delete_throwsResourceNotFoundException_whenCategoryNotFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found");
    }

    @Test
    void delete_throwsForbiddenException_whenDeletingStandardCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(standardCategory));

        assertThatThrownBy(() -> categoryService.delete(1L))
                .isInstanceOf(ForbiddenException.class)
                .hasMessage("Standard categories cannot be deleted");
    }

    @Test
    void delete_deletesUserOwnedCategory() {
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(userCategory));

        categoryService.delete(2L);

        verify(categoryRepository).delete(userCategory);
    }
}
