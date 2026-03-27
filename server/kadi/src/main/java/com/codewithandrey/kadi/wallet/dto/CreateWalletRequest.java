package com.codewithandrey.kadi.wallet.dto;

public record CreateWalletRequest(
        String name,
        String currency,
        Integer balance
) {
}
