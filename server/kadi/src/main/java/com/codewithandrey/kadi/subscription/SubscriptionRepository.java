package com.codewithandrey.kadi.subscription;

import com.codewithandrey.kadi.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findAllByWallet(Wallet wallet);
}
