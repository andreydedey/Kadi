package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.category.WalletCategory;
import com.codewithandrey.kadi.category.WalletCategoryRepository;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
import com.codewithandrey.kadi.transaction.dto.WeeklyTransactionSummaryDTO;
import com.codewithandrey.kadi.transaction.mapper.TransactionMapper;
import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.WalletRepository;
import com.codewithandrey.kadi.wallet.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private WalletRepository walletRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private TransactionMapper transactionMapper;
    @Mock
    private WalletService walletService;
    @Mock
    private AuthService authService;
    @Mock
    private WalletCategoryRepository walletCategoryRepository;

    @InjectMocks
    private TransactionService transactionService;

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
        wallet.setBalance(1000L);
        wallet.setUser(user);

        when(authService.currentUser()).thenReturn(user);
    }

    // --- listByWallet ---

    @Test
    void listByWallet_throwsResourceNotFoundException_whenWalletNotFound() {
        when(walletRepository.findById(walletId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.listByWallet(walletId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Wallet not found");
    }

    @Test
    void listByWallet_returnsTransactionsOrderedByDateDesc() {
        Transaction t1 = new Transaction();
        Transaction t2 = new Transaction();
        TransactionDetailDTO dto1 = makeDetailDTO(UUID.randomUUID(), TransactionType.EXPENSE);
        TransactionDetailDTO dto2 = makeDetailDTO(UUID.randomUUID(), TransactionType.INCOME);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByWalletOrderByEventDateDesc(wallet)).thenReturn(List.of(t1, t2));
        when(transactionMapper.toDetailDTO(t1)).thenReturn(dto1);
        when(transactionMapper.toDetailDTO(t2)).thenReturn(dto2);

        List<TransactionDetailDTO> result = transactionService.listByWallet(walletId);

        assertThat(result).containsExactly(dto1, dto2);
    }

    // --- listRecent ---

    @Test
    void listRecent_withWalletId_returnsTransactionsForOwnedWallet() {
        Transaction transaction = new Transaction();
        TransactionDetailDTO dto = makeDetailDTO(UUID.randomUUID(), TransactionType.EXPENSE);

        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(transactionRepository.findByWalletOrderByEventDateDesc(wallet)).thenReturn(List.of(transaction));
        when(transactionMapper.toDetailDTO(transaction)).thenReturn(dto);

        List<TransactionDetailDTO> result = transactionService.listRecent(walletId);

        assertThat(result).containsExactly(dto);
    }

    @Test
    void listRecent_withoutWalletId_returnsTransactionsForCurrentUser() {
        Transaction transaction = new Transaction();
        TransactionDetailDTO dto = makeDetailDTO(UUID.randomUUID(), TransactionType.INCOME);

        when(transactionRepository.findByWallet_UserOrderByEventDateDesc(user)).thenReturn(List.of(transaction));
        when(transactionMapper.toDetailDTO(transaction)).thenReturn(dto);

        List<TransactionDetailDTO> result = transactionService.listRecent(null);

        assertThat(result).containsExactly(dto);
    }

    // --- create ---

    @Test
    void create_throwsResourceNotFoundException_whenWalletNotFound() {
        TransactionDTO dto = makeDTO(TransactionType.EXPENSE, 200L, null, null, LocalDate.now());
        when(walletRepository.findById(walletId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.create(walletId, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Wallet not found");
    }

    @Test
    void create_expense_decreasesWalletBalance() {
        TransactionDTO dto = makeDTO(TransactionType.EXPENSE, 300L, null, null, LocalDate.now());
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.EXPENSE);
        TransactionDTO savedDTO = makeDTO(TransactionType.EXPENSE, 300L, null, null, LocalDate.now());

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionMapper.toEntity(dto)).thenReturn(transaction);
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        when(transactionMapper.toDTO(transaction)).thenReturn(savedDTO);

        transactionService.create(walletId, dto);

        verify(walletService).changeBalance(wallet, -300L);
    }

    @Test
    void create_income_increasesWalletBalance() {
        TransactionDTO dto = makeDTO(TransactionType.INCOME, 500L, null, null, LocalDate.now());
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.INCOME);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionMapper.toEntity(dto)).thenReturn(transaction);
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        when(transactionMapper.toDTO(transaction)).thenReturn(dto);

        transactionService.create(walletId, dto);

        verify(walletService).changeBalance(wallet, 500L);
    }

    @Test
    void create_transfer_decreasesSourceAndIncreasesDestination() {
        UUID destWalletId = UUID.randomUUID();
        Wallet destWallet = new Wallet();
        destWallet.setId(destWalletId);

        TransactionDTO dto = makeDTO(TransactionType.TRANSFER, 400L, null, destWalletId, LocalDate.now());
        dto = new TransactionDTO(dto.id(), dto.type(), dto.amount(), dto.categoryId(), destWalletId, 400L, dto.description(), dto.eventDate());
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.TRANSFER);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(walletRepository.findById(destWalletId)).thenReturn(Optional.of(destWallet));
        when(transactionMapper.toEntity(dto)).thenReturn(transaction);
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        when(transactionMapper.toDTO(transaction)).thenReturn(dto);

        transactionService.create(walletId, dto);

        verify(walletService).changeBalance(destWallet, 400L);
        verify(walletService).changeBalance(wallet, -400L);
    }

    @Test
    void create_throwsResourceNotFoundException_whenCategoryNotFound() {
        TransactionDTO dto = makeDTO(TransactionType.EXPENSE, 100L, 99L, null, LocalDate.now());
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.EXPENSE);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionMapper.toEntity(dto)).thenReturn(transaction);
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.create(walletId, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found");
    }

    @Test
    void create_updatesWalletCategoryLimit_whenExpenseInCurrentMonth() {
        Category category = new Category();
        category.setId(1L);

        WalletCategory walletCategory = new WalletCategory();
        walletCategory.setSpent(100L);

        TransactionDTO dto = makeDTO(TransactionType.EXPENSE, 200L, 1L, null, LocalDate.now());
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.EXPENSE);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionMapper.toEntity(dto)).thenReturn(transaction);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(walletCategoryRepository.findByWalletIdAndCategoryId(walletId, 1L))
                .thenReturn(Optional.of(walletCategory));
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        when(transactionMapper.toDTO(transaction)).thenReturn(dto);

        transactionService.create(walletId, dto);

        verify(walletService).changeCategoryLimit(walletCategory, 200L);
    }

    @Test
    void create_doesNotUpdateCategoryLimit_whenExpenseIsNotInCurrentMonth() {
        Category category = new Category();
        category.setId(1L);

        LocalDate pastDate = LocalDate.now().minusMonths(2);
        TransactionDTO dto = makeDTO(TransactionType.EXPENSE, 200L, 1L, null, pastDate);
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.EXPENSE);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionMapper.toEntity(dto)).thenReturn(transaction);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(transactionRepository.save(transaction)).thenReturn(transaction);
        when(transactionMapper.toDTO(transaction)).thenReturn(dto);

        transactionService.create(walletId, dto);

        verify(walletService, never()).changeCategoryLimit(any(), any(Long.class));
    }

    // --- delete ---

    @Test
    void delete_throwsResourceNotFoundException_whenTransactionNotFound() {
        UUID transactionId = UUID.randomUUID();
        when(transactionRepository.findById(transactionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.delete(walletId, transactionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Transaction not found");
    }

    @Test
    void delete_expense_reversesBalanceAndDeletesTransaction() {
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = new Transaction();
        transaction.setId(transactionId);
        transaction.setWallet(wallet);
        transaction.setType(TransactionType.EXPENSE);
        transaction.setAmount(300L);
        transaction.setEventDate(LocalDate.now().minusMonths(2));

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));

        transactionService.delete(walletId, transactionId);

        verify(walletService).changeBalance(wallet, 300L);
        verify(transactionRepository).delete(transaction);
    }

    @Test
    void delete_income_reversesBalanceAndDeletesTransaction() {
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = new Transaction();
        transaction.setId(transactionId);
        transaction.setWallet(wallet);
        transaction.setType(TransactionType.INCOME);
        transaction.setAmount(500L);
        transaction.setEventDate(LocalDate.now().minusMonths(2));

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));

        transactionService.delete(walletId, transactionId);

        verify(walletService).changeBalance(wallet, -500L);
        verify(transactionRepository).delete(transaction);
    }

    @Test
    void delete_transfer_reversesSourceAndDestinationBalances() {
        UUID transactionId = UUID.randomUUID();
        Wallet destWallet = new Wallet();
        destWallet.setId(UUID.randomUUID());
        destWallet.setBalance(500L);

        Transaction transaction = new Transaction();
        transaction.setId(transactionId);
        transaction.setWallet(wallet);
        transaction.setType(TransactionType.TRANSFER);
        transaction.setAmount(200L);
        transaction.setDestinationWallet(destWallet);
        transaction.setDestinationAmount(200L);
        transaction.setEventDate(LocalDate.now().minusMonths(2));

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));

        transactionService.delete(walletId, transactionId);

        verify(walletService).changeBalance(wallet, 200L);
        verify(walletService).changeBalance(destWallet, -200L);
        verify(transactionRepository).delete(transaction);
    }

    @Test
    void delete_expense_reversesCategoryLimitSpent_whenCurrentMonth() {
        UUID transactionId = UUID.randomUUID();
        Category category = new Category();
        category.setId(1L);
        WalletCategory walletCategory = new WalletCategory();
        walletCategory.setSpent(300L);

        Transaction transaction = new Transaction();
        transaction.setId(transactionId);
        transaction.setWallet(wallet);
        transaction.setType(TransactionType.EXPENSE);
        transaction.setAmount(200L);
        transaction.setCategory(category);
        transaction.setEventDate(LocalDate.now());

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));
        when(walletCategoryRepository.findByWalletIdAndCategoryId(walletId, 1L))
                .thenReturn(Optional.of(walletCategory));

        transactionService.delete(walletId, transactionId);

        verify(walletService).changeCategoryLimit(walletCategory, -200L);
    }

    // --- listWeeklySummary ---

    @Test
    void listWeeklySummary_throwsResourceNotFoundException_whenWalletNotFound() {
        when(walletRepository.findById(walletId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.listWeeklySummary(walletId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Wallet not found");
    }

    @Test
    void listWeeklySummary_groupsTransactionsByWeek() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);

        Transaction t1 = new Transaction();
        t1.setType(TransactionType.EXPENSE);
        t1.setAmount(100L);
        t1.setEventDate(monday);

        Transaction t2 = new Transaction();
        t2.setType(TransactionType.INCOME);
        t2.setAmount(500L);
        t2.setEventDate(monday.plusDays(1));

        Transaction t3 = new Transaction();
        t3.setType(TransactionType.EXPENSE);
        t3.setAmount(200L);
        t3.setEventDate(monday.minusWeeks(1));

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByWalletOrderByEventDateDesc(wallet))
                .thenReturn(List.of(t1, t2, t3));

        List<WeeklyTransactionSummaryDTO> result = transactionService.listWeeklySummary(walletId);

        assertThat(result).hasSize(2);
        WeeklyTransactionSummaryDTO currentWeek = result.get(0);
        assertThat(currentWeek.totalExpense()).isEqualTo(100L);
        assertThat(currentWeek.totalIncome()).isEqualTo(500L);

        WeeklyTransactionSummaryDTO previousWeek = result.get(1);
        assertThat(previousWeek.totalExpense()).isEqualTo(200L);
        assertThat(previousWeek.totalIncome()).isEqualTo(0L);
    }

    @Test
    void listWeeklySummary_includesTransferInExpenses() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);

        Transaction transfer = new Transaction();
        transfer.setType(TransactionType.TRANSFER);
        transfer.setAmount(300L);
        transfer.setEventDate(monday);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByWalletOrderByEventDateDesc(wallet))
                .thenReturn(List.of(transfer));

        List<WeeklyTransactionSummaryDTO> result = transactionService.listWeeklySummary(walletId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).totalExpense()).isEqualTo(300L);
        assertThat(result.get(0).totalIncome()).isEqualTo(0L);
    }

    @Test
    void listWeeklySummary_weekLabelIncludesDateRange() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);

        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.EXPENSE);
        transaction.setAmount(100L);
        transaction.setEventDate(monday);

        when(walletRepository.findById(walletId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByWalletOrderByEventDateDesc(wallet))
                .thenReturn(List.of(transaction));

        List<WeeklyTransactionSummaryDTO> result = transactionService.listWeeklySummary(walletId);

        assertThat(result.get(0).weekLabel()).contains("-");
        assertThat(result.get(0).startDate()).isEqualTo(monday);
        assertThat(result.get(0).endDate()).isEqualTo(monday.with(DayOfWeek.SUNDAY));
    }

    // --- helpers ---

    private TransactionDTO makeDTO(TransactionType type, Long amount, Long categoryId, UUID destWalletId, LocalDate date) {
        return new TransactionDTO(UUID.randomUUID(), type, amount, categoryId, destWalletId, null, null, date);
    }

    private TransactionDetailDTO makeDetailDTO(UUID id, TransactionType type) {
        return new TransactionDetailDTO(id, type, 100L, null, null, null, null, null, LocalDate.now());
    }
}
