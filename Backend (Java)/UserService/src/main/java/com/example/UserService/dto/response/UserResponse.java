package com.example.UserService.dto.response;

import com.example.UserService.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Long id;
    private String email;
    private User.Role role;
    private String dpUrl;
    private List<Long> children;
    private String preferences;
    private LocalDateTime createdAt;
}