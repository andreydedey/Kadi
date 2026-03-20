package com.codewithandrey.kadi.auth.dto;

public record LoginRequest(
        String username,
        String password
) {}
