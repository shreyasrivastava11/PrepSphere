package com.prepsphere.backend.dto.auth;

import com.prepsphere.backend.entity.Role;

public record AuthResponse(
        Long userId,
        String name,
        String email,
        Role role,
        String token
) {
}
