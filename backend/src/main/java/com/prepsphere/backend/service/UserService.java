package com.prepsphere.backend.service;

import com.prepsphere.backend.dto.user.ChangePasswordRequest;
import com.prepsphere.backend.dto.user.UpdateProfileRequest;
import com.prepsphere.backend.dto.user.UserProfileResponse;
import com.prepsphere.backend.entity.AppUser;
import com.prepsphere.backend.exception.ApiException;
import com.prepsphere.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getMe() {
        AppUser user = currentUser();
        return toResponse(user);
    }

    public UserProfileResponse updateMe(UpdateProfileRequest request) {
        AppUser user = currentUser();
        String nextEmail = request.email().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(nextEmail) && userRepository.existsByEmail(nextEmail)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already in use");
        }

        user.setName(request.name().trim());
        user.setEmail(nextEmail);
        return toResponse(userRepository.save(user));
    }

    public void changePassword(ChangePasswordRequest request) {
        AppUser user = currentUser();
        String currentPassword = request.currentPassword().trim();
        String newPassword = request.newPassword().trim();
        String confirmPassword = request.confirmPassword().trim();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "New password and confirm password do not match");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private AppUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private UserProfileResponse toResponse(AppUser user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
