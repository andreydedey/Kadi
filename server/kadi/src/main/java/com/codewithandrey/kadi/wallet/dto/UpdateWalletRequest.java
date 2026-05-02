package com.codewithandrey.kadi.wallet.dto;

public record UpdateWalletRequest(
        String name,
        Integer salaryDay,
        Long expectedMonthlyIncome
) {
}
