package com.codewithandrey.kadi.auth.dto;

public record UpdateProfileRequest(
        String username,
        String defaultCurrency
) {}
