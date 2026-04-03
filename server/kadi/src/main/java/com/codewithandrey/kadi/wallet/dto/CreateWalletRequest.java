package com.codewithandrey.kadi.wallet.dto;

public record CreateWalletRequest(
        String name,
        com.codewithandrey.kadi.wallet.Currency currency,
        Integer balance
) {
}
