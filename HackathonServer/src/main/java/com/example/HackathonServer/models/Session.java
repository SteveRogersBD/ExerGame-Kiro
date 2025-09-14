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
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    @JsonBackReference(value = "child-session")
    private Child child;
    @OneToOne
    @JoinColumn(name = "video_id", nullable = false)
    @JsonBackReference(value = "video-session")
    private Video video;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
    private String duration;
    @OneToOne
    @JoinColumn(name = "score_id", nullable = false)
    @JsonBackReference(value = "score-session")
    private Score score;





}
