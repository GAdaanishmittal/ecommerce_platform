package com.ecommerce.service;

import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.security.JwtService;
import com.ecommerce.model.Role;
import com.ecommerce.repository.RoleRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    public void register(RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCreatedAt(LocalDateTime.now());

        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole().toUpperCase()
                : "CUSTOMER";

        Role userRole = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
        user.setRoles(List.of(userRole));

        userRepository.save(user);
    }

    public String login(LoginRequest request, AuthenticationManager authenticationManager, JwtService jwtService) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        return jwtService.generateToken(request.getEmail());
    }
}