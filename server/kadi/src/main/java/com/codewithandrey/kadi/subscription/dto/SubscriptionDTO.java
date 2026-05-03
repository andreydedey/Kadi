package com.codewithandrey.kadi.subscription.dto;

import java.util.UUID;

public record SubscriptionDTO(UUID id, String name, Long amount) {}
