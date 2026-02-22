package com.prepsphere.backend.dto.user;

import com.prepsphere.backend.entity.Role;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
