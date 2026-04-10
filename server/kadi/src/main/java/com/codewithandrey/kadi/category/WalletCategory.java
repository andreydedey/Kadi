package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.wallet.Wallet;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "wallet_categories")
public class WalletCategory {
    @EmbeddedId
    private WalletCategoryId id;

    @ManyToOne
    @MapsId("walletId")
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;

    private Integer spendingLimit;
}
