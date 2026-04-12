package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WalletCategoryRepository extends JpaRepository<WalletCategory, WalletCategoryId> {
    List<WalletCategory> findByWallet(Wallet wallet);
    Optional<WalletCategory> findByWalletIdAndCategoryId(UUID walletId, Long categoryId);
}
