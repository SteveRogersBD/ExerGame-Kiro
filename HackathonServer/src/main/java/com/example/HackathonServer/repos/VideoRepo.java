package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepo extends JpaRepository<Video, Long> {
}
