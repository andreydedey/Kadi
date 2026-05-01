package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.category.WalletCategoryRepository;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
import com.codewithandrey.kadi.transaction.mapper.TransactionMapper;
import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.WalletRepository;
import com.codewithandrey.kadi.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionMapper transactionMapper;
    private final WalletService walletService;
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

        if (transactionDTO.type() == TransactionType.EXPENSE || transactionDTO.type() == TransactionType.TRANSFER) {
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

        // Reverse old balance and category effects
        switch (existing.getType()) {
            case EXPENSE, TRANSFER -> walletService.changeBalance(wallet, existing.getAmount());
            case INCOME -> walletService.changeBalance(wallet, -existing.getAmount());
        }
        if (existing.getDestinationWallet() != null) {
            walletService.changeBalance(existing.getDestinationWallet(), -existing.getDestinationAmount());
        }
        if (existing.getCategory() != null && (existing.getType() == TransactionType.EXPENSE || existing.getType() == TransactionType.TRANSFER)) {
            walletCategoryRepository.findByWalletIdAndCategoryId(walletId, existing.getCategory().getId())
                    .ifPresent(wc -> walletService.changeCategoryLimit(wc, -existing.getAmount()));
        }

        // Apply new values
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
        if (existing.getType() == TransactionType.EXPENSE || existing.getType() == TransactionType.TRANSFER) {
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
        if (transaction.getCategory() != null && (transaction.getType() == TransactionType.EXPENSE || transaction.getType() == TransactionType.TRANSFER)) {
            walletCategoryRepository.findByWalletIdAndCategoryId(walletId, transaction.getCategory().getId())
                    .ifPresent(wc -> walletService.changeCategoryLimit(wc, -transaction.getAmount()));
        }

        transactionRepository.delete(transaction);
    }
}
