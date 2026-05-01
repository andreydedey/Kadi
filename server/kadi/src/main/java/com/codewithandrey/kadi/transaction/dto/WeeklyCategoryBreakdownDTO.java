package com.codewithandrey.kadi.transaction.dto;

public record WeeklyCategoryBreakdownDTO(
        Long categoryId,
        String categoryName,
        long amount,
        double percentage
) {
}
