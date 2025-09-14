package com.example.HackathonServer.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    private String dp;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "parent",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Child> children;
    @OneToMany(mappedBy = "parent",cascade = CascadeType.ALL)
    @JsonManagedReference(value = "parent-homework")
    private List<Homework> homeworks;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
