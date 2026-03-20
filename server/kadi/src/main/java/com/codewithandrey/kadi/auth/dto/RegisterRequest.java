package com.codewithandrey.kadi.auth.dto;

public record RegisterRequest(
        String username, String email, String password
) {}
