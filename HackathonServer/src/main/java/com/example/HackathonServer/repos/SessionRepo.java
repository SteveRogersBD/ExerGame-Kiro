package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepo extends JpaRepository<Session, Long> {
}
