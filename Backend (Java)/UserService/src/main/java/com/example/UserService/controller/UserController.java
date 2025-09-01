package com.example.UserService.controller;

import com.example.UserService.dto.request.UpdateUserRequest;
import com.example.UserService.dto.response.UserResponse;
import com.example.UserService.entity.User;
import com.example.UserService.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    @Autowired
    private final UserService userService;

    /**
     * Retrieves a list of all users in the system.
     *
     * @return ResponseEntity containing list of UserResponse objects
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.debug("Getting all users");
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Retrieves a specific user by their ID.
     *
     * @param userId the unique identifier of the user
     * @return ResponseEntity containing UserResponse object
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        log.debug("Getting user info for: {}", userId);
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    /**
     * Retrieves a user by their email address.
     *
     * @param email the email address of the user
     * @return ResponseEntity containing UserResponse object
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        log.debug("Getting user info for email: {}", email);
        UserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Retrieves all users with a specific role.
     *
     * @param role the role to filter users by
     * @return ResponseEntity containing a list of UserResponse objects
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable User.Role role) {
        log.debug("Getting users by role: {}", role);
        List<UserResponse> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
     * Updates user information.
     *
     * @param userId  the ID of the user to update
     * @param request the update request containing new user information
     * @return ResponseEntity containing updated UserResponse object
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        log.info("Updating user: {}", userId);
        UserResponse updatedUser = userService.updateUser(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Adds a child user to a parent user.
     *
     * @param parentId the ID of the parent user
     * @param childId  the ID of the child user to add
     * @return ResponseEntity containing an updated parent UserResponse object
     */
    @PostMapping("/{parentId}/children/{childId}")
    public ResponseEntity<UserResponse> addChildToUser(
            @PathVariable Long parentId,
            @PathVariable Long childId) {
        log.info("Adding child {} to parent {}", childId, parentId);
        UserResponse updatedParent = userService.addChildToUser(parentId, childId);
        return ResponseEntity.ok(updatedParent);
    }

    /**
     * Removes a child user from a parent user.
     *
     * @param parentId the ID of the parent user
     * @param childId  the ID of the child user to remove
     * @return ResponseEntity containing an updated parent UserResponse object
     */
    @DeleteMapping("/{parentId}/children/{childId}")
    public ResponseEntity<UserResponse> removeChildFromUser(
            @PathVariable Long parentId,
            @PathVariable Long childId) {
        log.info("Removing child {} from parent {}", childId, parentId);
        UserResponse updatedParent = userService.removeChildFromUser(parentId, childId);
        return ResponseEntity.ok(updatedParent);
    }

    /**
     * Retrieves all children of a specific user.
     *
     * @param parentId the ID of the parent user
     * @return ResponseEntity containing a list of child UserResponse objects
     */
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<UserResponse>> getChildrenOfUser(
            @PathVariable Long parentId) {
        log.debug("Getting children of user: {}", parentId);
        List<UserResponse> children = userService.getChildrenOfUser(parentId);
        return ResponseEntity.ok(children);
    }

    /**
     * Deletes a user from the system.
     *
     * @param userId the ID of the user to delete
     * @return ResponseEntity containing a success message
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        log.info("Deleting user: {}", userId);
        userService.deleteUser(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}