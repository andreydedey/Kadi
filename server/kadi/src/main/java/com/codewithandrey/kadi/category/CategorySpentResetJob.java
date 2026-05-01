package com.codewithandrey.kadi.category;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CategorySpentResetJob {

    private final WalletCategoryRepository walletCategoryRepository;

    @Scheduled(cron = "0 0 0 1 * *")
    @Transactional
    public void resetMonthlySpent() {
        walletCategoryRepository.findAll().forEach(wc -> wc.setSpent(0L));
    }
}
