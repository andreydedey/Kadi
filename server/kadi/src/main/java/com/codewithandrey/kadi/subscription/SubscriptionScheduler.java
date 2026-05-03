package com.codewithandrey.kadi.subscription;

import com.codewithandrey.kadi.exception.InsufficientBalanceException;
import com.codewithandrey.kadi.transaction.mapper.TransactionMapper;
import com.codewithandrey.kadi.transaction.TransactionRepository;
import com.codewithandrey.kadi.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final WalletService walletService;

    @Scheduled(cron = "0 0 0 1 * *")
    @Transactional
    public void chargeSubscriptions() {
        List<Subscription> activeSubscriptions = subscriptionRepository.findAllByStatus(SubscriptionStatus.ACTIVE);
        log.info("Charging {} active subscriptions", activeSubscriptions.size());

        for (Subscription subscription : activeSubscriptions) {
            try {
                walletService.changeBalance(subscription.getWallet(), -subscription.getAmount());
                transactionRepository.save(transactionMapper.toEntity(subscription));

                log.info("Charged subscription '{}' for wallet '{}'", subscription.getName(), subscription.getWallet().getName());
            } catch (InsufficientBalanceException e) {
                subscription.setStatus(SubscriptionStatus.INACTIVE);
                subscriptionRepository.save(subscription);
                log.warn("Subscription '{}' deactivated due to insufficient balance in wallet '{}'", subscription.getName(), subscription.getWallet().getName());
            }
        }
    }
}
