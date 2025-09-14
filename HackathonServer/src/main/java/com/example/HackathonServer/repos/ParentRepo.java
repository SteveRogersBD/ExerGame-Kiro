package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepo extends JpaRepository<Parent, Long> {
    Optional<Parent> findByEmailAndPassword(String email, String password);
}
