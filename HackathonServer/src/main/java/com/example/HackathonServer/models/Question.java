package com.example.HackathonServer.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "video_id")
    @JsonBackReference(value = "video-question")
    private Video video;
    @Column(name = "question",nullable = false)
    private String question;

    @Column(nullable = false)
    private String timeToStop;

    @Column(nullable = false)
    private String optA;

    @Column(nullable = false)
    private String optB;

    @Column(nullable = false)
    private String optC;

    @Column(nullable = false)
    private String correctAns;
}
