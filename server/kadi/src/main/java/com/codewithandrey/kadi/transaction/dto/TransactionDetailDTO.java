package com.codewithandrey.kadi.transaction.dto;

import com.codewithandrey.kadi.transaction.TransactionType;

import java.time.LocalDate;
import java.util.UUID;

public record TransactionDetailDTO(
        UUID id,
        TransactionType type,
        Long amount,
        String categoryName,
        UUID destinationWalletId,
        Long destinationAmount,
        String description,
        LocalDate eventDate
) {
}
