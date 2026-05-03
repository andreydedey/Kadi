package com.codewithandrey.kadi.subscription;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.subscription.dto.CreateSubscriptionRequest;
import com.codewithandrey.kadi.subscription.dto.SubscriptionDTO;
import com.codewithandrey.kadi.subscription.mapper.SubscriptionMapper;
import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final CategoryRepository categoryRepository;
    private final WalletService walletService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<SubscriptionDTO> listSubscriptions(UUID walletId) {
        Wallet wallet = walletService.findOwnedWallet(walletId);
        return subscriptionRepository.findAllByWallet(wallet)
                .stream()
                .map(subscriptionMapper::toDTO)
                .toList();
    }

    @Transactional
    public SubscriptionDTO createSubscription(UUID walletId, CreateSubscriptionRequest createSubscriptionRequest) {
        Wallet wallet = walletService.findOwnedWallet(walletId);

        Subscription subscription = new Subscription();
        subscription.setName(createSubscriptionRequest.name());
        subscription.setAmount(createSubscriptionRequest.amount());
        subscription.setWallet(wallet);

        if (createSubscriptionRequest.categoryId() != null) {
            Category category = categoryRepository.findById(createSubscriptionRequest.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            subscription.setCategory(category);
        }

        return subscriptionMapper.toDTO(subscriptionRepository.save(subscription));
    }

    @Transactional
    public void deleteSubscription(UUID subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        if (!subscription.getWallet().getUser().getId().equals(authService.currentUser().getId())) {
            throw new ResourceNotFoundException("Subscription not found");
        }
        subscriptionRepository.delete(subscription);
    }
}
