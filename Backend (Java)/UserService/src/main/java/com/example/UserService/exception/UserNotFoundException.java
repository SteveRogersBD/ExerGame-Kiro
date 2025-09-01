package com.example.UserService.exception;

public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(String message) {
        super(message);
    }
    
    public UserNotFoundException(String userId, String field) {
        super(String.format("User not found with %s: %s", field, userId));
    }
}