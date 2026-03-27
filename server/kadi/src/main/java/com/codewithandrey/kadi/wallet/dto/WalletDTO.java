package com.codewithandrey.kadi.wallet.dto;

import java.util.UUID;

public record WalletDTO(
        UUID uuid,
        String name,
        String currency,
        Integer balance)
{
}
