package com.example.HackathonServer.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Move {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    @JsonBackReference(value = "child-move")
    private Child child;
    @OneToOne
    @JoinColumn(name = "session_id", nullable = false)
    @JsonBackReference(value = "session-move")
    private Session session;
    private String type; //jump,squat,clap
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


}
