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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserCategoryLimitRepository userCategoryLimitRepository;
    private final TransactionRepository transactionRepository;
    private final AuthService authService;

    private static final List<TransactionType> SPENDING_TYPES =
            List.of(TransactionType.EXPENSE, TransactionType.TRANSFER);

    @Transactional(readOnly = true)
    public List<CategoryDTO> list() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDetailDTO> listDetail() {
        User user = authService.currentUser();

        Map<Long, Long> limitsMap = userCategoryLimitRepository.findByUser(user).stream()
                .collect(Collectors.toMap(ucl -> ucl.getCategory().getId(), UserCategoryLimit::getLimit));

        Map<Long, Long> spentMap = transactionRepository
                .sumSpentGroupedByCategoryForUser(user, SPENDING_TYPES)
                .stream()
                .collect(Collectors.toMap(
                        TransactionRepository.CategorySpent::getCategoryId,
                        TransactionRepository.CategorySpent::getTotalSpent
                ));

        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDetailDTO(
                        category.getId(),
                        category.getName(),
                        category.getUser() == null,
                        limitsMap.get(category.getId()),
                        spentMap.getOrDefault(category.getId(), 0L)
                ))
                .toList();
    }

    @Transactional
    public CategoryDetailDTO create(CategoryRequest request) {
        User user = authService.currentUser();
        Category category = new Category();
        category.setName(request.name());
        category.setUser(user);
        category = categoryRepository.save(category);

        if (request.limit() != null) {
            saveLimit(user, category, request.limit());
        }

        return new CategoryDetailDTO(category.getId(), category.getName(), false, request.limit(), 0L);
    }

    @Transactional
    public CategoryDetailDTO update(Long id, CategoryRequest request) {
        User user = authService.currentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (category.getUser() == null) {
            throw new ForbiddenException("Standard categories cannot be modified");
        }
        category.setName(request.name());
        categoryRepository.save(category);

        if (request.limit() != null) {
            saveLimit(user, category, request.limit());
        } else {
            userCategoryLimitRepository.findByUserAndCategory(user, category)
                    .ifPresent(userCategoryLimitRepository::delete);
        }

        Long spent = spentForCategory(user, id);
        return new CategoryDetailDTO(category.getId(), category.getName(), false, request.limit(), spent);
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (category.getUser() == null) {
            throw new ForbiddenException("Standard categories cannot be deleted");
        }
        categoryRepository.delete(category);
    }

    private void saveLimit(User user, Category category, Long amount) {
        UserCategoryLimit limit = userCategoryLimitRepository
                .findByUserAndCategory(user, category)
                .orElse(new UserCategoryLimit());
        limit.setId(new UserCategoryLimitId(user.getId(), category.getId()));
        limit.setUser(user);
        limit.setCategory(category);
        limit.setLimit(amount);
        userCategoryLimitRepository.save(limit);
    }

    private Long spentForCategory(User user, Long categoryId) {
        return transactionRepository.sumSpentGroupedByCategoryForUser(user, SPENDING_TYPES)
                .stream()
                .filter(cs -> cs.getCategoryId().equals(categoryId))
                .map(TransactionRepository.CategorySpent::getTotalSpent)
                .findFirst()
                .orElse(0L);
    }
}
