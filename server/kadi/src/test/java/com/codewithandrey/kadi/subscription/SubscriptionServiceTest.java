package com.codewithandrey.kadi.subscription;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.subscription.dto.CreateSubscriptionRequest;
import com.codewithandrey.kadi.subscription.dto.SubscriptionDTO;
import com.codewithandrey.kadi.subscription.mapper.SubscriptionMapper;
import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;
    @Mock
    private SubscriptionMapper subscriptionMapper;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private WalletService walletService;
    @Mock
    private AuthService authService;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User user;
    private Wallet wallet;
    private UUID walletId;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());

        walletId = UUID.randomUUID();
        wallet = new Wallet();
        wallet.setId(walletId);
        wallet.setUser(user);

        when(authService.currentUser()).thenReturn(user);
    }

    // --- listSubscriptions ---

    @Test
    void listSubscriptions_withWalletId_returnsSubscriptionsForThatWallet() {
        Subscription subscription = new Subscription();
        SubscriptionDTO dto = new SubscriptionDTO(UUID.randomUUID(), "Netflix", 1500L, SubscriptionStatus.ACTIVE);

        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(subscriptionRepository.findAllByWallet(wallet)).thenReturn(List.of(subscription));
        when(subscriptionMapper.toDTO(subscription)).thenReturn(dto);

        List<SubscriptionDTO> result = subscriptionService.listSubscriptions(walletId);

        assertThat(result).containsExactly(dto);
    }

    @Test
    void listSubscriptions_withoutWalletId_returnsAllSubscriptionsForCurrentUser() {
        Subscription subscription = new Subscription();
        SubscriptionDTO dto = new SubscriptionDTO(UUID.randomUUID(), "Spotify", 900L, SubscriptionStatus.ACTIVE);

        when(subscriptionRepository.findAllByWallet_User(user)).thenReturn(List.of(subscription));
        when(subscriptionMapper.toDTO(subscription)).thenReturn(dto);

        List<SubscriptionDTO> result = subscriptionService.listSubscriptions(null);

        assertThat(result).containsExactly(dto);
    }

    @Test
    void listSubscriptions_withWalletId_returnsEmptyList_whenNoSubscriptions() {
        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(subscriptionRepository.findAllByWallet(wallet)).thenReturn(List.of());

        List<SubscriptionDTO> result = subscriptionService.listSubscriptions(walletId);

        assertThat(result).isEmpty();
    }

    // --- createSubscription ---

    @Test
    void createSubscription_savesSubscriptionWithoutCategory_whenCategoryIdIsNull() {
        CreateSubscriptionRequest request = new CreateSubscriptionRequest("Netflix", 1500L, null);
        Subscription subscription = new Subscription();
        SubscriptionDTO dto = new SubscriptionDTO(UUID.randomUUID(), "Netflix", 1500L, SubscriptionStatus.ACTIVE);

        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(subscription);
        when(subscriptionMapper.toDTO(subscription)).thenReturn(dto);

        SubscriptionDTO result = subscriptionService.createSubscription(walletId, request);

        assertThat(result).isEqualTo(dto);
        verify(subscriptionRepository).save(any(Subscription.class));
    }

    @Test
    void createSubscription_savesSubscriptionWithCategory_whenCategoryIdIsProvided() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Entertainment");

        CreateSubscriptionRequest request = new CreateSubscriptionRequest("Netflix", 1500L, 1L);
        Subscription subscription = new Subscription();
        SubscriptionDTO dto = new SubscriptionDTO(UUID.randomUUID(), "Netflix", 1500L, SubscriptionStatus.ACTIVE);

        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> {
            Subscription s = invocation.getArgument(0);
            assertThat(s.getCategory()).isEqualTo(category);
            return subscription;
        });
        when(subscriptionMapper.toDTO(subscription)).thenReturn(dto);

        SubscriptionDTO result = subscriptionService.createSubscription(walletId, request);

        assertThat(result).isEqualTo(dto);
    }

    @Test
    void createSubscription_throwsResourceNotFoundException_whenCategoryNotFound() {
        CreateSubscriptionRequest request = new CreateSubscriptionRequest("Netflix", 1500L, 99L);

        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subscriptionService.createSubscription(walletId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found");
    }

    @Test
    void createSubscription_setsNameAmountAndWallet() {
        CreateSubscriptionRequest request = new CreateSubscriptionRequest("Spotify", 900L, null);
        Subscription savedSubscription = new Subscription();
        SubscriptionDTO dto = new SubscriptionDTO(UUID.randomUUID(), "Spotify", 900L, SubscriptionStatus.ACTIVE);

        when(walletService.findOwnedWallet(walletId)).thenReturn(wallet);
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> {
            Subscription s = invocation.getArgument(0);
            assertThat(s.getName()).isEqualTo("Spotify");
            assertThat(s.getAmount()).isEqualTo(900L);
            assertThat(s.getWallet()).isEqualTo(wallet);
            return savedSubscription;
        });
        when(subscriptionMapper.toDTO(savedSubscription)).thenReturn(dto);

        subscriptionService.createSubscription(walletId, request);
    }

    // --- deleteSubscription ---

    @Test
    void deleteSubscription_throwsResourceNotFoundException_whenSubscriptionNotFound() {
        UUID subscriptionId = UUID.randomUUID();
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subscriptionService.deleteSubscription(subscriptionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Subscription not found");
    }

    @Test
    void deleteSubscription_throwsResourceNotFoundException_whenSubscriptionBelongsToAnotherUser() {
        UUID subscriptionId = UUID.randomUUID();
        User otherUser = new User();
        otherUser.setId(UUID.randomUUID());

        Wallet otherWallet = new Wallet();
        otherWallet.setUser(otherUser);

        Subscription subscription = new Subscription();
        subscription.setId(subscriptionId);
        subscription.setWallet(otherWallet);

        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(subscription));

        assertThatThrownBy(() -> subscriptionService.deleteSubscription(subscriptionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Subscription not found");
    }

    @Test
    void deleteSubscription_deletesSubscription_whenOwnedByCurrentUser() {
        UUID subscriptionId = UUID.randomUUID();

        Subscription subscription = new Subscription();
        subscription.setId(subscriptionId);
        subscription.setWallet(wallet);

        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(subscription));

        subscriptionService.deleteSubscription(subscriptionId);

        verify(subscriptionRepository).delete(subscription);
    }
}
