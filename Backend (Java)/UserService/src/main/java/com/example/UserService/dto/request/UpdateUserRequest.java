package com.example.UserService.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.List;

@Data
public class UpdateUserRequest {
    
    @Email(message = "Email should be valid")
    private String email;
    
    private String dpUrl;
    
    private List<Long> children;
    
    private String preferences;
}