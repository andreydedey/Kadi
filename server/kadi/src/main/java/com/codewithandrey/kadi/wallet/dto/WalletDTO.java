package com.codewithandrey.kadi.wallet.dto;

import java.util.UUID;

public record WalletDTO(
        UUID id,
        String name,
        String currency,
        Integer balance)
{
}
