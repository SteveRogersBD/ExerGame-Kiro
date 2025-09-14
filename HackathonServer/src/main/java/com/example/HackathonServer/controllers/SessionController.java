package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Session;
import com.example.HackathonServer.repos.SessionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionRepo sessionRepo;

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return ResponseEntity.of(sessionRepo.findById(id));
    }

    @PostMapping
    public Session createSession(@RequestBody Session session) {
        return sessionRepo.save(session);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session session) {
        if (!sessionRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        //session.setId(id);
        return ResponseEntity.ok(sessionRepo.save(session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        if (!sessionRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sessionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
