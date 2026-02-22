package com.prepsphere.backend.controller;

import com.prepsphere.backend.dto.user.ChangePasswordRequest;
import com.prepsphere.backend.dto.user.UpdateProfileRequest;
import com.prepsphere.backend.dto.user.UserProfileResponse;
import com.prepsphere.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserProfileResponse me() {
        return userService.getMe();
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserProfileResponse updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateMe(request);
    }

    @PutMapping("/me/password")
    @PreAuthorize("hasRole('USER')")
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
    }
}
