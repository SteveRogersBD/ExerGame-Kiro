package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepo extends JpaRepository<Score, Long> {
}
