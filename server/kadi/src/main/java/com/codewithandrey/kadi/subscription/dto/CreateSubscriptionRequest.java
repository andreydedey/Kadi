package com.codewithandrey.kadi.subscription.dto;

public record CreateSubscriptionRequest(String name, Long amount, Long categoryId) {}
