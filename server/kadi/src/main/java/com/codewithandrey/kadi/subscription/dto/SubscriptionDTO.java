package com.codewithandrey.kadi.subscription.dto;

import com.codewithandrey.kadi.subscription.SubscriptionStatus;

import java.util.UUID;

public record SubscriptionDTO(UUID id, String name, Long amount, SubscriptionStatus status) {}
