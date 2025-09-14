package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Homework;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeworkRepo extends JpaRepository<Homework, Long> {
}
