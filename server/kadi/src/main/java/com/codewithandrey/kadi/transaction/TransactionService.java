package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
import com.codewithandrey.kadi.transaction.mapper.TransactionMapper;
import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.WalletRepository;
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
    public TransactionDTO create(UUID walletId, TransactionDTO request) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        Transaction transaction = transactionMapper.toEntity(request);
        transaction.setWallet(wallet);

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            transaction.setCategory(category);
        }

        if (request.destinationWalletId() != null) {
            Wallet destinationWallet = walletRepository.findById(request.destinationWalletId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));
            transaction.setDestinationWallet(destinationWallet);
            destinationWallet.setBalance(destinationWallet.getBalance() + request.destinationAmount());
            walletRepository.save(destinationWallet);
        }

        switch (request.type()) {
            case EXPENSE -> wallet.setBalance(wallet.getBalance() - request.amount());
            case INCOME -> wallet.setBalance(wallet.getBalance() + request.amount());
            case TRANSFER -> wallet.setBalance(wallet.getBalance() - request.amount());
        }
        walletRepository.save(walleokt);

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }
}
