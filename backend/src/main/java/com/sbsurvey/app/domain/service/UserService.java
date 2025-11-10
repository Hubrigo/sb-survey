package com.sbsurvey.app.domain.service;

import com.sbsurvey.app.domain.model.AppUser;
import com.sbsurvey.app.domain.model.Role;
import com.sbsurvey.app.domain.repository.RoleRepository;
import com.sbsurvey.app.domain.repository.UserRepository;
import com.sbsurvey.app.security.JwtTokenService;
import com.sbsurvey.app.web.dto.LoginRequest;
import com.sbsurvey.app.web.dto.RegisterUserRequest;
import com.sbsurvey.app.web.dto.UserDto;
import com.sbsurvey.app.web.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;

    public UserDto registerAdmin(RegisterUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) || userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Username or email already registered");
        }
        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ADMIN");
                    return roleRepository.save(role);
                });
        user.setRoles(Collections.singleton(adminRole));

        AppUser saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    public Map<String, String> authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenService.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());
        return Map.of("token", token);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new EntityNotFoundException("No authenticated user");
        }
        String username = authentication.getName();
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
}
