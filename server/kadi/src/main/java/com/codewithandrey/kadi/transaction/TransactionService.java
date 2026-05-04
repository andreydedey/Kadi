package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.category.WalletCategoryRepository;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
import com.codewithandrey.kadi.transaction.dto.WeeklyCategoryBreakdownDTO;
import com.codewithandrey.kadi.transaction.dto.WeeklyTransactionSummaryDTO;
import com.codewithandrey.kadi.transaction.mapper.TransactionMapper;
import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.WalletRepository;
import com.codewithandrey.kadi.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionMapper transactionMapper;
    private final WalletService walletService;
    private final AuthService authService;
    private final WalletCategoryRepository walletCategoryRepository;

    @Transactional(readOnly = true)
    public List<TransactionDetailDTO> listByWallet(UUID walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        return transactionRepository.findByWalletOrderByEventDateDesc(wallet)
                .stream()
                .map(transactionMapper::toDetailDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionDetailDTO> listRecent(UUID walletId) {
        if (walletId != null) {
            Wallet wallet = walletService.findOwnedWallet(walletId);
            return transactionRepository.findByWalletOrderByEventDateDesc(wallet)
                    .stream()
                    .map(transactionMapper::toDetailDTO)
                    .toList();
        }
        return transactionRepository.findByWallet_UserOrderByEventDateDesc(authService.currentUser())
                .stream()
                .map(transactionMapper::toDetailDTO)
                .toList();
    }

    @Transactional
    public TransactionDTO create(UUID walletId, TransactionDTO transactionDTO) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        Transaction transaction = transactionMapper.toEntity(transactionDTO);
        transaction.setWallet(wallet);

        if (transactionDTO.categoryId() != null) {
            Category category = categoryRepository.findById(transactionDTO.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            transaction.setCategory(category);
        }

        if (transactionDTO.destinationWalletId() != null) {
            Wallet destinationWallet = walletRepository.findById(transactionDTO.destinationWalletId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));
            transaction.setDestinationWallet(destinationWallet);
            walletService.changeBalance(destinationWallet, transactionDTO.destinationAmount());
        }

        switch (transactionDTO.type()) {
            case EXPENSE, TRANSFER -> walletService.changeBalance(wallet, -transactionDTO.amount());
            case INCOME -> walletService.changeBalance(wallet, transactionDTO.amount());
        }

        if (isCurrentMonth(transactionDTO.eventDate()) && (transactionDTO.type() == TransactionType.EXPENSE || transactionDTO.type() == TransactionType.TRANSFER)) {
            walletCategoryRepository.findByWalletIdAndCategoryId(walletId, transactionDTO.categoryId())
                    .ifPresent(wc -> walletService.changeCategoryLimit(wc, transactionDTO.amount()));
        }

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionDTO update(UUID walletId, UUID transactionId, TransactionDTO request) {
        Transaction existing = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        Wallet wallet = existing.getWallet();

        switch (existing.getType()) {
            case EXPENSE, TRANSFER -> walletService.changeBalance(wallet, existing.getAmount());
            case INCOME -> walletService.changeBalance(wallet, -existing.getAmount());
        }
        if (existing.getDestinationWallet() != null) {
            walletService.changeBalance(existing.getDestinationWallet(), -existing.getDestinationAmount());
        }
        if (isCurrentMonth(existing.getEventDate()) && existing.getCategory() != null && (existing.getType() == TransactionType.EXPENSE || existing.getType() == TransactionType.TRANSFER)) {
            walletCategoryRepository.findByWalletIdAndCategoryId(walletId, existing.getCategory().getId())
                    .ifPresent(wc -> walletService.changeCategoryLimit(wc, -existing.getAmount()));
        }

        existing.setAmount(request.amount());
        existing.setDescription(request.description());
        existing.setEventDate(request.eventDate());

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            existing.setCategory(category);
        } else {
            existing.setCategory(null);
        }

        if (request.destinationWalletId() != null) {
            Wallet destinationWallet = walletRepository.findById(request.destinationWalletId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));
            existing.setDestinationWallet(destinationWallet);
            existing.setDestinationAmount(request.destinationAmount());
            walletService.changeBalance(destinationWallet, request.destinationAmount());
        }

        switch (existing.getType()) {
            case EXPENSE, TRANSFER -> walletService.changeBalance(wallet, -request.amount());
            case INCOME -> walletService.changeBalance(wallet, request.amount());
        }
        if (isCurrentMonth(request.eventDate()) && (existing.getType() == TransactionType.EXPENSE || existing.getType() == TransactionType.TRANSFER)) {
            walletCategoryRepository.findByWalletIdAndCategoryId(walletId, request.categoryId())
                    .ifPresent(wc -> walletService.changeCategoryLimit(wc, request.amount()));
        }

        return transactionMapper.toDTO(transactionRepository.save(existing));
    }

    @Transactional
    public void delete(UUID walletId, UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        Wallet wallet = transaction.getWallet();

        switch (transaction.getType()) {
            case EXPENSE, TRANSFER -> walletService.changeBalance(wallet, transaction.getAmount());
            case INCOME -> walletService.changeBalance(wallet, -transaction.getAmount());
        }
        if (transaction.getDestinationWallet() != null) {
            walletService.changeBalance(transaction.getDestinationWallet(), -transaction.getDestinationAmount());
        }
        if (isCurrentMonth(transaction.getEventDate()) && transaction.getCategory() != null && (transaction.getType() == TransactionType.EXPENSE || transaction.getType() == TransactionType.TRANSFER)) {
            walletCategoryRepository.findByWalletIdAndCategoryId(walletId, transaction.getCategory().getId())
                    .ifPresent(wc -> walletService.changeCategoryLimit(wc, -transaction.getAmount()));
        }

        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public List<WeeklyTransactionSummaryDTO> listWeeklySummary(UUID walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        List<Transaction> transactions = transactionRepository.findByWalletOrderByEventDateDesc(wallet);

        WeekFields weekFields = WeekFields.ISO;

        Map<Integer, List<Transaction>> byWeek = transactions.stream()
                .collect(Collectors.groupingBy(t -> {
                    LocalDate d = t.getEventDate();
                    int week = d.get(weekFields.weekOfWeekBasedYear());
                    int year = d.get(weekFields.weekBasedYear());
                    return year * 100 + week;
                }));

        return byWeek.entrySet().stream()
                .sorted(Map.Entry.<Integer, List<Transaction>>comparingByKey().reversed())
                .map(entry -> buildWeeklySummary(entry.getValue()))
                .toList();
    }

    private WeeklyTransactionSummaryDTO buildWeeklySummary(List<Transaction> transactions) {
        LocalDate anyDate = transactions.get(0).getEventDate();
        LocalDate startDate = anyDate.with(DayOfWeek.MONDAY);
        LocalDate endDate = anyDate.with(DayOfWeek.SUNDAY);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM d");
        String weekLabel = startDate.format(fmt) + " - " + endDate.format(fmt) + ", " + endDate.getYear();

        List<Transaction> expenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE || t.getType() == TransactionType.TRANSFER)
                .toList();
        List<Transaction> incomes = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .toList();

        long totalExpense = expenses.stream().mapToLong(Transaction::getAmount).sum();
        long totalIncome = incomes.stream().mapToLong(Transaction::getAmount).sum();

        return new WeeklyTransactionSummaryDTO(
                weekLabel,
                startDate,
                endDate,
                totalExpense,
                totalIncome,
                buildCategoryBreakdown(expenses, totalExpense),
                buildCategoryBreakdown(incomes, totalIncome)
        );
    }

    private record CategoryKey(Long id, String name) {}

    private List<WeeklyCategoryBreakdownDTO> buildCategoryBreakdown(List<Transaction> transactions, long total) {
        if (total == 0) return List.of();

        Map<CategoryKey, Long> byCategory = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() != null
                                ? new CategoryKey(t.getCategory().getId(), t.getCategory().getName())
                                : new CategoryKey(null, "Uncategorized"),
                        Collectors.summingLong(Transaction::getAmount)
                ));

        return byCategory.entrySet().stream()
                .sorted(Map.Entry.<CategoryKey, Long>comparingByValue().reversed())
                .map(e -> new WeeklyCategoryBreakdownDTO(
                        e.getKey().id(),
                        e.getKey().name(),
                        e.getValue(),
                        (double) e.getValue() / total * 100
                ))
                .toList();
    }

    private boolean isCurrentMonth(LocalDate date) {
        LocalDate now = LocalDate.now();
        return date.getMonth() == now.getMonth() && date.getYear() == now.getYear();
    }
}
