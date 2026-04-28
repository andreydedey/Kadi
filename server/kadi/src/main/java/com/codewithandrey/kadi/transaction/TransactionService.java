package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
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

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }
}
