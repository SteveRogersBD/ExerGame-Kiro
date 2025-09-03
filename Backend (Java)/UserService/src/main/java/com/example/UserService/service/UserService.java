package com.example.UserService.service;

import com.example.UserService.dto.request.UpdateUserRequest;
import com.example.UserService.dto.response.UserResponse;
import com.example.UserService.entity.User;
import com.example.UserService.exception.EmailAlreadyExistsException;
import com.example.UserService.exception.UserNotFoundException;
import com.example.UserService.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    
    private final UserRepo userRepo;
    
    public UserResponse getUserById(Long userId) {
        log.debug("Fetching user by id: {}", userId);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId+"", "id"));
        return mapToUserResponse(user);
    }
    
    public UserResponse getUserByEmail(String email) {
        log.debug("Fetching user by email: {}", email);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, "email"));
        return mapToUserResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        log.debug("Fetching all users");
        List<User> users = userRepo.findAll();
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getUsersByRole(User.Role role) {
        log.debug("Fetching users by role: {}", role);
        List<User> users = userRepo.findByRole(role);
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }
    
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        log.debug("Updating user: {}", userId);
        
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId+"", "id"));
        
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepo.existsByEmail(request.getEmail())) {
                throw new EmailAlreadyExistsException(request.getEmail());
            }
            user.setEmail(request.getEmail());
            log.debug("Updated email for user: {}", userId);
        }
        
        if (request.getDpUrl() != null) {
            user.setDpUrl(request.getDpUrl());
            log.debug("Updated dp_url for user: {}", userId);
        }
        
        if (request.getChildren() != null) {
            user.setChildren(request.getChildren());
            log.debug("Updated children list for user: {}", userId);
        }

        User savedUser = userRepo.save(user);
        log.info("Successfully updated user: {}", userId);
        return mapToUserResponse(savedUser);
    }
    
    public UserResponse addChildToUser(Long parentId, Long childId) {
        log.debug("Adding child {} to parent {}", childId, parentId);
        
        User parent = userRepo.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException(parentId+"", "id"));
        
        // Verify child exists
        if (!userRepo.existsById(childId)) {
            throw new UserNotFoundException(childId+"", "id");
        }
        
        if (parent.getChildren() == null) {
            parent.setChildren(new java.util.ArrayList<>());
        }
        
        if (!parent.getChildren().contains(childId)) {
            parent.getChildren().add(childId);
            User savedParent = userRepo.save(parent);
            log.info("Successfully added child {} to parent {}", childId, parentId);
            return mapToUserResponse(savedParent);
        }
        
        return mapToUserResponse(parent);
    }
    
    public UserResponse removeChildFromUser(Long parentId, Long childId) {
        log.debug("Removing child {} from parent {}", childId, parentId);
        
        User parent = userRepo.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException(parentId+"", "id"));
        
        if (parent.getChildren() != null) {
            parent.getChildren().remove(childId);
            User savedParent = userRepo.save(parent);
            log.info("Successfully removed child {} from parent {}", childId, parentId);
            return mapToUserResponse(savedParent);
        }
        
        return mapToUserResponse(parent);
    }
    
    public List<UserResponse> getChildrenOfUser(Long parentId) {
        log.debug("Getting children of user: {}", parentId);
        
        User parent = userRepo.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException(parentId+"", "id"));
        
        if (parent.getChildren() == null || parent.getChildren().isEmpty()) {
            return new java.util.ArrayList<>();
        }
        
        List<User> children = userRepo.findAllById(parent.getChildren());
        return children.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteUser(Long userId) {
        log.debug("Deleting user: {}", userId);
        
        if (!userRepo.existsById(userId)) {
            throw new UserNotFoundException(userId+"", "id");
        }
        
        // Remove this user from any parent's children list
        List<User> allUsers = userRepo.findAll();
        for (User user : allUsers) {
            if (user.getChildren() != null && user.getChildren().contains(userId)) {
                user.getChildren().remove(userId);
                userRepo.save(user);
                log.debug("Removed user {} from parent {}'s children list", userId, user.getId());
            }
        }
        
        userRepo.deleteById(userId);
        log.info("Successfully deleted user: {}", userId);
    }
    
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setDpUrl(user.getDpUrl());
        response.setChildren(user.getChildren());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}