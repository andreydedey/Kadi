package com.codewithandrey.kadi.category.dto;

import java.util.UUID;

public record CreateWalletCategoryRequest(UUID walletId, Long categoryId, Long spendingLimit) {
}
