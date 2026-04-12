package com.codewithandrey.kadi.category.dto;

public record WalletCategoryDTO(
        Long id,
        String name,
        Long spendingLimit,
        Long spent) {
}
