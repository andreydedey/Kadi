package com.codewithandrey.kadi.auth.dto;

public record UpdatePasswordRequest(
        String currentPassword,
        String newPassword
) {}
