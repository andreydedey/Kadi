package com.codewithandrey.kadi.auth.dto;

import java.util.UUID;

public record UserDTO(
        UUID id,
        String username,
        String email
) {}
