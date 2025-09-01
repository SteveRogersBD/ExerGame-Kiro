package com.example.UserService.service;

import com.example.UserService.dto.request.LoginRequest;
import com.example.UserService.dto.request.RegisterRequest;
import com.example.UserService.dto.response.UserResponse;
import com.example.UserService.entity.User;
import com.example.UserService.exception.EmailAlreadyExistsException;
import com.example.UserService.exception.InvalidCredentialsException;
import com.example.UserService.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepo userRepo;
    private final SecureRandom random = new SecureRandom();

    public UserResponse register(RegisterRequest request) {
        log.debug("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(hashPassword(request.getPassword()));
        user.setRole(request.getRole());
        user.setDpUrl(request.getDpUrl());
        user.setChildren(request.getChildren());
        user.setPreferences(request.getPreferences());

        User savedUser = userRepo.save(user);
        log.info("Successfully registered user: {} with role: {}", savedUser.getEmail(), savedUser.getRole());

        return mapToUserResponse(savedUser);
    }

    public UserResponse login(LoginRequest request) {
        log.debug("Login attempt for email: {}", request.getEmail());

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException());

        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password attempt for email: {}", request.getEmail());
            throw new InvalidCredentialsException();
        }

        log.info("Successful login for user: {}", user.getEmail());
        return mapToUserResponse(user);
    }

    private String hashPassword(String password) {
        try {
            // Generate a random salt
            byte[] salt = new byte[16];
            random.nextBytes(salt);

            // Create MessageDigest instance for SHA-256
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);

            // Hash the password
            byte[] hashedPassword = md.digest(password.getBytes());

            // Combine salt and hash
            byte[] saltAndHash = new byte[salt.length + hashedPassword.length];
            System.arraycopy(salt, 0, saltAndHash, 0, salt.length);
            System.arraycopy(hashedPassword, 0, saltAndHash, salt.length, hashedPassword.length);

            // Encode to Base64
            return Base64.getEncoder().encodeToString(saltAndHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    private boolean verifyPassword(String password, String hashedPassword) {
        try {
            // Decode the stored hash
            byte[] saltAndHash = Base64.getDecoder().decode(hashedPassword);

            // Extract salt (first 16 bytes)
            byte[] salt = new byte[16];
            System.arraycopy(saltAndHash, 0, salt, 0, 16);

            // Extract hash (remaining bytes)
            byte[] hash = new byte[saltAndHash.length - 16];
            System.arraycopy(saltAndHash, 16, hash, 0, hash.length);

            // Hash the provided password with the same salt
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] testHash = md.digest(password.getBytes());

            // Compare hashes
            return MessageDigest.isEqual(hash, testHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error verifying password", e);
        }
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setDpUrl(user.getDpUrl());
        response.setChildren(user.getChildren());
        response.setPreferences(user.getPreferences());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}