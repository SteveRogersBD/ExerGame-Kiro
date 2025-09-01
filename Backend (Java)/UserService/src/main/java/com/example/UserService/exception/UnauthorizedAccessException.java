package com.example.UserService.exception;

public class UnauthorizedAccessException extends RuntimeException {
    
    public UnauthorizedAccessException() {
        super("Access denied: insufficient permissions");
    }
    
    public UnauthorizedAccessException(String message) {
        super(message);
    }
    
    public UnauthorizedAccessException(String resource, String action) {
        super(String.format("Access denied: cannot %s %s", action, resource));
    }
}