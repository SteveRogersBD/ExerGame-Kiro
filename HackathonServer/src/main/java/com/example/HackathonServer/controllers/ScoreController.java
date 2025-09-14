package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Score;
import com.example.HackathonServer.repos.ScoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/score")
public class ScoreController {

    @Autowired
    private ScoreRepo scoreRepo;

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

}
