package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Child;
import com.example.HackathonServer.models.Score;
import com.example.HackathonServer.models.Session;
import com.example.HackathonServer.repos.ChildRepo;
import com.example.HackathonServer.repos.ScoreRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/score")
public class ScoreController {

    @Autowired
    private ScoreRepo scoreRepo;
    @Autowired
    private ChildRepo childRepo;

    @GetMapping
    public List<Score> getAllScores() {
        return scoreRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Score> getScoreById(@PathVariable Long id) {
        return ResponseEntity.of(scoreRepo.findById(id));
    }

    @PostMapping
    public Score createScore(@RequestBody Score score) {
        return scoreRepo.save(score);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Score> updateScore(@PathVariable Long id, @RequestBody Score score) {
        if (!scoreRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        score.setId(id);
        return ResponseEntity.ok(scoreRepo.save(score));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScore(@PathVariable Long id) {
        if (!scoreRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        scoreRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{childId}/last-week/average")
    public ResponseEntity<Double> getLastWeekAvrg(@PathVariable Long childId) {
        Child child = childRepo.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Session>scores = child.getSessions();
        int totalScore = 0;
        int sessionCount = 0;
        for (Session session : scores) {
            if (!session.getCreatedAt().isAfter(weekAgo)) continue;
            totalScore += session.getScore().getScore();
            sessionCount++;
        }

        double avrg = (sessionCount > 0 ? (totalScore / 
                (double) sessionCount) * 100 : 0.0);
        return ResponseEntity.ok(avrg);
        
    }
    
    @GetMapping("{childId}/last-week/grade")
    public ResponseEntity<String> getLastWeekGrade(@PathVariable Long childId) {
        Child child = childRepo.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Session>scores = child.getSessions();
        int totalScore = 0;
        int sessionCount = 0;
        for (Session session : scores) {
            if (!session.getCreatedAt().isAfter(weekAgo)) continue;
            totalScore += session.getScore().getScore();
            sessionCount++;
        }

        double avrg = (sessionCount > 0 ? (totalScore /
                (double) sessionCount) * 100 : 0.0);
        if(avrg>=90) return ResponseEntity.ok("A");
        else if(avrg>=80) return ResponseEntity.ok("B");
        else if(avrg>=70) return ResponseEntity.ok("C");
        else if(avrg>=60) return ResponseEntity.ok("D");
        else return ResponseEntity.ok("F");
    }

    @GetMapping("/{childId}/last-month/average")
    public ResponseEntity<Double> getLastMonthAvrg(@PathVariable Long childId) {
        Child child = childRepo.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        List<Session> scores = child.getSessions();
        int totalScore = 0;
        int sessionCount = 0;
        for (Session session : scores) {
            if (!session.getCreatedAt().isAfter(monthAgo)) continue;
            totalScore += session.getScore().getScore();
            sessionCount++;
        }

        double avrg = (sessionCount > 0 ? (totalScore /
                (double) sessionCount) * 100 : 0.0);
        return ResponseEntity.ok(avrg);
    }

    @GetMapping("{childId}/last-month/grade")
    public ResponseEntity<String> getLastMonthGrade(@PathVariable Long childId) {
        Child child = childRepo.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        List<Session> scores = child.getSessions();
        int totalScore = 0;
        int sessionCount = 0;
        for (Session session : scores) {
            if (!session.getCreatedAt().isAfter(monthAgo)) continue;
            totalScore += session.getScore().getScore();
            sessionCount++;
        }

        double avrg = (sessionCount > 0 ? (totalScore /
                (double) sessionCount) * 100 : 0.0);
        if (avrg >= 90) return ResponseEntity.ok("A");
        else if (avrg >= 80) return ResponseEntity.ok("B");
        else if (avrg >= 70) return ResponseEntity.ok("C");
        else if (avrg >= 60) return ResponseEntity.ok("D");
        else return ResponseEntity.ok("F");
    }

}
