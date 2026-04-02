package com.codewithandrey.kadi.category;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class WalletCategoryId implements Serializable {
    private UUID walletId;
    private Long categoryId;
}
