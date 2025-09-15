package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Child;
import com.example.HackathonServer.models.Move;
import com.example.HackathonServer.models.Session;
import com.example.HackathonServer.repos.ChildRepo;
import com.example.HackathonServer.repos.MoveRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/move")
public class MoveController {

    @Autowired
    private MoveRepo moveRepo;
    @Autowired
    private ChildRepo childRepo;

    @GetMapping
    public ResponseEntity<List<Move>> getAllMoves() {
        return ResponseEntity.ok(moveRepo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Move> getMoveById(@PathVariable Long id) {
        Optional<Move> move = moveRepo.findById(id);
        if (move.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(move.get());
    }

    @PostMapping
    public ResponseEntity<Move> createMove(@RequestBody Move move) {
        Move savedMove = moveRepo.save(move);
        return ResponseEntity.ok(savedMove);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Move> updateMove(@PathVariable Long id, @RequestBody Move move) {
        if (!moveRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        move.setId(id);
        Move updatedMove = moveRepo.save(move);
        return ResponseEntity.ok(updatedMove);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMove(@PathVariable Long id) {
        if (!moveRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        moveRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{childId}")
    public ResponseEntity<Map<String,Integer>>getTotalMovesByChild(@PathVariable Long childId)
    {
        Child child = childRepo.findById(childId).orElseThrow(
                ()->new EntityNotFoundException("Child not found"));
        List<Session>sessions = child.getSessions();
        List<Move>moveList = new ArrayList<>();
        int jump=0,squat=0,clap=0,totalMoves=0;
        // add all the moves from all the sessions to the list
        for(Session session:sessions)
        {
            List<Move>moves = session.getMoves();
            moveList.addAll(moves);
            for(Move move:moves)
            {
                if(move.getType()=="JUMP") jump++;
                else if(move.getType()=="SQUAT") squat++;
                else if(move.getType()=="CLAP") clap++;
            }
        }
        totalMoves = jump+squat+clap;
        Map<String,Integer>map = Map.of("jump",jump,"squat",squat,"clap",clap,"totalMoves",totalMoves);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/last7days/{childId}")
    public ResponseEntity<Map<String, Integer>> getTotalMovesByChildLast7Days
            (@PathVariable Long childId) 
    {
        Child child = childRepo.findById(childId).orElseThrow(
                () -> new EntityNotFoundException("Child not found"));
        List<Session> sessions = child.getSessions();
        List<Move> moveList = new ArrayList<>();
        int jump = 0, squat = 0, clap = 0, totalMoves = 0;
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);

        for (Session session : sessions) {
            List<Move> moves = session.getMoves();
            for (Move move : moves) {
                if (move.getCreatedAt().isAfter(sevenDaysAgo)) {
                    if (move.getType() == "JUMP") jump++;
                    else if (move.getType() == "SQUAT") squat++;
                    else if (move.getType() == "CLAP") clap++;
                }
            }
        }
        totalMoves = jump + squat + clap;
        Map<String, Integer> map = Map.of("jump", jump, "squat", squat, "clap", clap, "totalMoves", totalMoves);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/last30days/{childId}")
    public ResponseEntity<Map<String, Integer>> getTotalMovesByChildLast30Days
            (@PathVariable Long childId) {
        Child child = childRepo.findById(childId).orElseThrow(
                () -> new EntityNotFoundException("Child not found"));
        List<Session> sessions = child.getSessions();
        List<Move> moveList = new ArrayList<>();
        int jump = 0, squat = 0, clap = 0, totalMoves = 0;
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minus(30, ChronoUnit.DAYS);

        for (Session session : sessions) {
            List<Move> moves = session.getMoves();
            for (Move move : moves) {
                if (move.getCreatedAt().isAfter(thirtyDaysAgo)) {
                    if (move.getType() == "JUMP") jump++;
                    else if (move.getType() == "SQUAT") squat++;
                    else if (move.getType() == "CLAP") clap++;
                }
            }
        }
        totalMoves = jump + squat + clap;
        Map<String, Integer> map = Map.of("jump", jump, "squat", squat, "clap", clap, "totalMoves", totalMoves);
        return ResponseEntity.ok(map);
    }
}
    

