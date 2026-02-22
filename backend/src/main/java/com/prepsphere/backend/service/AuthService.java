package com.prepsphere.backend.service;

import com.prepsphere.backend.config.JwtService;
import com.prepsphere.backend.dto.auth.AuthResponse;
import com.prepsphere.backend.dto.auth.LoginRequest;
import com.prepsphere.backend.dto.auth.RegisterUserRequest;
import com.prepsphere.backend.entity.AppUser;
import com.prepsphere.backend.entity.Role;
import com.prepsphere.backend.exception.ApiException;
import com.prepsphere.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse registerUser(RegisterUserRequest request) {
        return register(request.name(), request.email(), request.password(), Role.USER);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password().trim())
        );

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        String token = jwtService.generateToken(user, Map.of("role", user.getRole().name(), "name", user.getName()));
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token);
    }

    private AuthResponse register(String name, String email, String password, Role role) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedName = name.trim();
        String normalizedPassword = password.trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }

        AppUser user = AppUser.builder()
                .name(normalizedName)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(normalizedPassword))
                .role(role)
                .build();

        AppUser saved = userRepository.save(user);
        String token = jwtService.generateToken(saved, Map.of("role", saved.getRole().name(), "name", saved.getName()));
        return new AuthResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), token);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
