package com.codewithandrey.kadi.wallet.dto;

import com.codewithandrey.kadi.wallet.Currency;

import java.util.UUID;

public record WalletDTO(
        UUID id,
        String name,
        Currency currency,
        Integer balance)
{
}
