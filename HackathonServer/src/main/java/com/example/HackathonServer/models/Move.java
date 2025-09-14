package com.example.HackathonServer.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Move {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int jump;
    private int squat;
    private int clap;
    @OneToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;
    @OneToOne
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;
    
}
