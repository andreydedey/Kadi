package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletCategoryRepository extends JpaRepository<WalletCategory, WalletCategoryId> {
    List<WalletCategory> findByWallet(Wallet wallet);
}
