package com.codewithandrey.kadi.auth.dto;

public record LoginRequest(
        String email,
        String password
) {}
