package com.codewithandrey.kadi.transaction.dto;

import com.codewithandrey.kadi.transaction.TransactionType;

import java.time.LocalDate;
import java.util.UUID;

public record TransactionDTO(
        UUID id,
        TransactionType type,
        Long amount,
        Long categoryId,
        UUID destinationWalletId,
        Long destinationAmount,
        String description,
        LocalDate eventDate
) {
}
