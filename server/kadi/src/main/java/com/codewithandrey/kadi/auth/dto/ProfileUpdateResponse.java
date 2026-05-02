package com.codewithandrey.kadi.auth.dto;

public record ProfileUpdateResponse(
        UserDTO user,
        String token
) {}
