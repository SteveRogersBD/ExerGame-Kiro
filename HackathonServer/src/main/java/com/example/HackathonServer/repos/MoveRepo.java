package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Move;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MoveRepo extends JpaRepository<Move,Long> {
    List<Move> findByChildIdAndCreatedAtAfter(Long id, LocalDateTime weekAgo);

}
