package com.example.HackathonServer.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String url;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "video-question")
    private List<Question> questions;
    @OneToOne(mappedBy = "video", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "video-homework")
    private Homework homework;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
