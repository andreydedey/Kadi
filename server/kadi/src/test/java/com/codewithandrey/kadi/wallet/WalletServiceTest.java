package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.category.WalletCategory;
import com.codewithandrey.kadi.category.WalletCategoryRepository;
import com.codewithandrey.kadi.category.dto.CreateWalletCategoryRequest;
import com.codewithandrey.kadi.category.dto.UpdateWalletCategoryRequest;
import com.codewithandrey.kadi.category.dto.WalletCategoryDTO;
import com.codewithandrey.kadi.category.mapper.WalletCategoryMapper;
import com.codewithandrey.kadi.exception.ConflictException;
import com.codewithandrey.kadi.exception.InsufficientBalanceException;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.wallet.dto.CreateWalletRequest;
import com.codewithandrey.kadi.wallet.dto.UpdateWalletRequest;
import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import com.codewithandrey.kadi.wallet.mapper.WalletMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;
    @Mock
    private WalletCategoryRepository walletCategoryRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private WalletMapper walletMapper;
    @Mock
    private WalletCategoryMapper walletCategoryMapper;
    @Mock
    private AuthService authService;

    @InjectMocks
    private WalletService walletService;

    private User user;
    private Wallet wallet;
    private UUID walletId;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());

        walletId = UUID.randomUUID();
        wallet = new Wallet();
        wallet.setId(walletId);
        wallet.setName("Test Wallet");
        wallet.setBalance(1000L);
        wallet.setUser(user);

        when(authService.currentUser()).thenReturn(user);
    }

    @Test
    void listWallets_returnsPageOfWalletDTOs() {
        WalletDTO dto = new WalletDTO(walletId, "Test Wallet", Currency.USD, 1000L, null, null, false);
        Page<Wallet> page = new PageImpl<>(List.of(wallet));
        when(walletRepository.findAllByUserAndArchived(user, false, Pageable.unpaged())).thenReturn(page);
        when(walletMapper.toDTO(wallet)).thenReturn(dto);

        Page<WalletDTO> result = walletService.listWallets(Pageable.unpaged());

        assertThat(result.getContent()).containsExactly(dto);
    }

    @Test
    void getWallet_returnsDTO_whenWalletOwnedByCurrentUser() {
        WalletDTO dto = new WalletDTO(walletId, "Test Wallet", Currency.USD, 1000L, null, null, false);
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(walletMapper.toDTO(wallet)).thenReturn(dto);

        WalletDTO result = walletService.getWallet(walletId);

        assertThat(result).isEqualTo(dto);
    }

    @Test
    void getWallet_throwsResourceNotFoundException_whenWalletNotFound() {
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> walletService.getWallet(walletId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("wallet not found");
    }

    @Test
    void createWallet_throwsConflictException_whenNameAlreadyExists() {
        CreateWalletRequest request = new CreateWalletRequest("Test Wallet", Currency.USD, 500L, null, null);
        when(walletRepository.existsByNameAndUser("Test Wallet", user)).thenReturn(true);

        assertThatThrownBy(() -> walletService.createWallet(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("A wallet with this name already exists");

        verify(walletRepository, never()).save(any());
    }

    @Test
    void createWallet_savesWalletAndReturnsDTO_whenNameIsUnique() {
        CreateWalletRequest request = new CreateWalletRequest("New Wallet", Currency.USD, 500L, null, null);
        Wallet newWallet = new Wallet();
        WalletDTO dto = new WalletDTO(UUID.randomUUID(), "New Wallet", Currency.USD, 500L, null, null, false);
        when(walletRepository.existsByNameAndUser("New Wallet", user)).thenReturn(false);
        when(walletMapper.toEntity(request)).thenReturn(newWallet);
        when(walletRepository.save(newWallet)).thenReturn(newWallet);
        when(walletMapper.toDTO(newWallet)).thenReturn(dto);

        WalletDTO result = walletService.createWallet(request);

        assertThat(newWallet.getUser()).isEqualTo(user);
        assertThat(result).isEqualTo(dto);
    }

    @Test
    void updateWallet_throwsConflictException_whenNewNameConflictsWithAnotherWallet() {
        UpdateWalletRequest request = new UpdateWalletRequest("Existing Name", null, null);
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(walletRepository.existsByNameAndUserAndIdNot("Existing Name", user, walletId)).thenReturn(true);

        assertThatThrownBy(() -> walletService.updateWallet(walletId, request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("A wallet with this name already exists");
    }

    @Test
    void updateWallet_updatesFieldsAndReturnsDTO() {
        UpdateWalletRequest request = new UpdateWalletRequest("Renamed Wallet", 15, 5000L);
        WalletDTO dto = new WalletDTO(walletId, "Renamed Wallet", Currency.USD, 1000L, 15, 5000L, false);
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(walletRepository.existsByNameAndUserAndIdNot("Renamed Wallet", user, walletId)).thenReturn(false);
        when(walletRepository.save(wallet)).thenReturn(wallet);
        when(walletMapper.toDTO(wallet)).thenReturn(dto);

        WalletDTO result = walletService.updateWallet(walletId, request);

        assertThat(wallet.getName()).isEqualTo("Renamed Wallet");
        assertThat(wallet.getSalaryDay()).isEqualTo(15);
        assertThat(wallet.getExpectedMonthlyIncome()).isEqualTo(5000L);
        assertThat(result).isEqualTo(dto);
    }

    @Test
    void listWalletCategories_returnsMappedDTOs() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Food");

        WalletCategory walletCategory = new WalletCategory();
        walletCategory.setCategory(category);
        walletCategory.setSpendingLimit(500L);
        walletCategory.setSpent(200L);

        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(walletCategoryRepository.findByWallet(wallet)).thenReturn(List.of(walletCategory));

        List<WalletCategoryDTO> result = walletService.listWalletCategories(walletId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).name()).isEqualTo("Food");
        assertThat(result.get(0).spendingLimit()).isEqualTo(500L);
        assertThat(result.get(0).spent()).isEqualTo(200L);
    }

    @Test
    void createWalletCategoryLimit_throwsResourceNotFoundException_whenCategoryNotFound() {
        CreateWalletCategoryRequest request = new CreateWalletCategoryRequest(walletId, 99L, 1000L);
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> walletService.createWalletCategoryLimit(walletId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found");
    }

    @Test
    void createWalletCategoryLimit_savesAndReturnsDTOWithZeroSpent() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Food");

        CreateWalletCategoryRequest request = new CreateWalletCategoryRequest(walletId, 1L, 500L);
        WalletCategory walletCategory = new WalletCategory();
        WalletCategoryDTO dto = new WalletCategoryDTO(1L, "Food", 500L, 0L);

        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(walletCategoryMapper.toEntity(request)).thenReturn(walletCategory);
        when(walletCategoryRepository.save(walletCategory)).thenReturn(walletCategory);
        when(walletCategoryMapper.toDTO(walletCategory)).thenReturn(dto);

        WalletCategoryDTO result = walletService.createWalletCategoryLimit(walletId, request);

        assertThat(walletCategory.getSpent()).isEqualTo(0L);
        assertThat(walletCategory.getWallet()).isEqualTo(wallet);
        assertThat(walletCategory.getCategory()).isEqualTo(category);
        assertThat(result).isEqualTo(dto);
    }

    @Test
    void updateWalletCategoryLimit_throwsResourceNotFoundException_whenExistingNotFound() {
        UpdateWalletCategoryRequest request = new UpdateWalletCategoryRequest(2L, 800L);
        when(walletCategoryRepository.findByWalletIdAndCategoryId(walletId, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> walletService.updateWalletCategoryLimit(walletId, 1L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category limit not found");
    }

    @Test
    void updateWalletCategoryLimit_deletesOldAndSavesNewWithPreservedSpent() {
        Category oldCategory = new Category();
        oldCategory.setId(1L);

        Category newCategory = new Category();
        newCategory.setId(2L);
        newCategory.setName("Transport");

        WalletCategory existing = new WalletCategory();
        existing.setCategory(oldCategory);
        existing.setSpent(150L);

        UpdateWalletCategoryRequest request = new UpdateWalletCategoryRequest(2L, 800L);
        WalletCategory newWalletCategory = new WalletCategory();
        WalletCategoryDTO dto = new WalletCategoryDTO(2L, "Transport", 800L, 150L);

        when(walletCategoryRepository.findByWalletIdAndCategoryId(walletId, 1L)).thenReturn(Optional.of(existing));
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(newCategory));
        when(walletCategoryMapper.toEntity(request)).thenReturn(newWalletCategory);
        when(walletCategoryRepository.save(newWalletCategory)).thenReturn(newWalletCategory);
        when(walletCategoryMapper.toDTO(newWalletCategory)).thenReturn(dto);

        WalletCategoryDTO result = walletService.updateWalletCategoryLimit(walletId, 1L, request);

        verify(walletCategoryRepository).delete(existing);
        assertThat(newWalletCategory.getSpent()).isEqualTo(150L);
        assertThat(result).isEqualTo(dto);
    }

    @Test
    void deleteWalletCategoryLimit_throwsResourceNotFoundException_whenNotFound() {
        when(walletCategoryRepository.findByWalletIdAndCategoryId(walletId, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> walletService.deleteWalletCategoryLimit(walletId, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category limit not found");
    }

    @Test
    void deleteWalletCategoryLimit_deletesWalletCategory_whenFound() {
        WalletCategory walletCategory = new WalletCategory();
        when(walletCategoryRepository.findByWalletIdAndCategoryId(walletId, 1L)).thenReturn(Optional.of(walletCategory));

        walletService.deleteWalletCategoryLimit(walletId, 1L);

        verify(walletCategoryRepository).delete(walletCategory);
    }

    @Test
    void changeBalance_updatesBalance_whenResultIsNonNegative() {
        walletService.changeBalance(wallet, 500L);

        assertThat(wallet.getBalance()).isEqualTo(1500L);
        verify(walletRepository).save(wallet);
    }

    @Test
    void changeBalance_throwsInsufficientBalanceException_whenBalanceGoesNegative() {
        assertThatThrownBy(() -> walletService.changeBalance(wallet, -2000L))
                .isInstanceOf(InsufficientBalanceException.class);

        verify(walletRepository, never()).save(any());
    }

    @Test
    void changeBalance_allowsZeroBalance() {
        walletService.changeBalance(wallet, -1000L);

        assertThat(wallet.getBalance()).isEqualTo(0L);
        verify(walletRepository).save(wallet);
    }

    @Test
    void changeCategoryLimit_addsAmountToSpent() {
        WalletCategory walletCategory = new WalletCategory();
        walletCategory.setSpent(100L);

        walletService.changeCategoryLimit(walletCategory, 50L);

        assertThat(walletCategory.getSpent()).isEqualTo(150L);
        verify(walletCategoryRepository).save(walletCategory);
    }

    @Test
    void archiveWallet_setsArchivedTrueAndSaves() {
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));

        walletService.archiveWallet(walletId);

        assertThat(wallet.isArchived()).isTrue();
        verify(walletRepository).save(wallet);
    }

    @Test
    void deleteWallet_deletesWallet() {
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.of(wallet));

        walletService.deleteWallet(walletId);

        verify(walletRepository).delete(wallet);
    }

    @Test
    void findOwnedWallet_throwsResourceNotFoundException_whenWalletNotFoundOrNotOwned() {
        when(walletRepository.findByIdAndUser(walletId, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> walletService.findOwnedWallet(walletId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("wallet not found");
    }
}
