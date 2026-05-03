package com.codewithandrey.kadi.subscription;

import com.codewithandrey.kadi.subscription.dto.CreateSubscriptionRequest;
import com.codewithandrey.kadi.subscription.dto.SubscriptionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<List<SubscriptionDTO>> listSubscriptions(@PathVariable UUID walletId) {
        return ResponseEntity.ok(subscriptionService.listSubscriptions(walletId));
    }

    @PostMapping("/wallet/{walletId}")
    public ResponseEntity<SubscriptionDTO> createSubscription(
            @PathVariable UUID walletId,
            @RequestBody CreateSubscriptionRequest createSubscriptionRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.createSubscription(walletId, createSubscriptionRequest));
    }

    @DeleteMapping("/{subscriptionId}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.deleteSubscription(subscriptionId);
        return ResponseEntity.noContent().build();
    }
}
