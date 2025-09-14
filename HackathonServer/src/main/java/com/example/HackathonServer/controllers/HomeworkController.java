package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Child;
import com.example.HackathonServer.models.Homework;
import com.example.HackathonServer.models.Parent;
import com.example.HackathonServer.models.Video;
import com.example.HackathonServer.repos.ChildRepo;
import com.example.HackathonServer.repos.HomeworkRepo;
import com.example.HackathonServer.repos.ParentRepo;
import com.example.HackathonServer.repos.VideoRepo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/homework")
public class HomeworkController {

    @Autowired
    private HomeworkRepo homeworkRepo;
    @Autowired
    private ParentRepo parentRepo;
    @Autowired
    private ChildRepo childRepo;
    @Autowired
    private VideoRepo videoRepo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class HomeworkRequest{
        String title;
        String url;
        Long childId;
        Long parentId;
    };

    @GetMapping
    public List<Homework> getAllHomework() {
        return homeworkRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Homework> getHomeworkById(@PathVariable Long id) {
        return homeworkRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Homework> createHomework(@RequestBody HomeworkRequest hw)
    {
        Parent parent = parentRepo.findById(hw.getParentId()).
                orElseThrow(()->new RuntimeException("Parent not found"));
        Child child = childRepo.findById(hw.getChildId()).
                orElseThrow(()->new RuntimeException("Child not found"));
        Video video = new Video();
        video.setTitle(hw.getTitle());
        video.setUrl(hw.getUrl());
        Video savedVideo = videoRepo.save(video);
        Homework homework = new Homework();
        homework.setVideo(savedVideo);
        homework.setParent(parent);
        homework.setChild(child);
        homework.setTitle(hw.getTitle());
        Homework saved = homeworkRepo.save(homework);
        homework.setChild(child);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Homework> updateHomework(@PathVariable Long id, @RequestBody Homework homework) {
        return homeworkRepo.findById(id)
                .map(existingHomework -> {
                    homework.setId(id);
                    return ResponseEntity.ok(homeworkRepo.save(homework));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHomework(@PathVariable Long id) {
        return homeworkRepo.findById(id)
                .map(homework -> {
                    homeworkRepo.delete(homework);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
