package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Child;
import com.example.HackathonServer.models.Session;
import com.example.HackathonServer.repos.ChildRepo;
import com.example.HackathonServer.repos.SessionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionRepo sessionRepo;
    @Autowired
    private ChildRepo childRepo;

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
    
    @GetMapping("/{childId}/last-week/total-hour")
    public ResponseEntity<Integer>getTotalHourLastWeek(@PathVariable Long childId)
    {
        Child child = childRepo.findById(childId).orElseThrow(()->{
            return new RuntimeException("Child not found");
        });
        List<Session>sessions = child.getSessions();
        int total = 0;
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        for(Session session:sessions)
        {
            if(session.getCreatedAt().isAfter(sevenDaysAgo)) continue;
            total += Integer.parseInt(session.getDuration());
        }
        return ResponseEntity.ok(total);
        
    }

    @GetMapping("/{childId}/last-month/total-hour")
    public ResponseEntity<Integer> getTotalHourLastMonth(@PathVariable Long childId) {
        Child child = childRepo.findById(childId).orElseThrow(() -> {
            return new RuntimeException("Child not found");
        });
        List<Session> sessions = child.getSessions();
        int total = 0;
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        for (Session session : sessions) {
            if (session.getCreatedAt().isAfter(thirtyDaysAgo)) continue;
            total += Integer.parseInt(session.getDuration());
        }
        return ResponseEntity.ok(total);
    }

    @GetMapping("/{childId}/recent")
    public ResponseEntity<List<Session>> getRecentSessions(@PathVariable Long childId) {
        Child child = childRepo.findById(childId).orElseThrow(() -> {
            return new RuntimeException("Child not found");
        });
        List<Session> sessions = child.getSessions();
        Collections.reverse(sessions);
        return ResponseEntity.ok(sessions);
    }


}
