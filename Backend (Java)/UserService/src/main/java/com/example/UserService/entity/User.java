package com.example.UserService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "username", nullable = false)
    private String username;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(name = "dp_url")
    private String dpUrl;
    
    @ElementCollection
    @CollectionTable(name = "user_children",
            joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "child_id")
    private List<Long> children;
    
    @Column(columnDefinition = "JSON")
    private String preferences;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum Role {
        USER, ADMIN
    }

}