package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Video;
import com.example.HackathonServer.repos.VideoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/video")
public class VideoController {
    
    @Autowired
    private VideoRepo videoRepo;

    @GetMapping
    public List<Video> getAllVideos() {
        return videoRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        return ResponseEntity.of(videoRepo.findById(id));
    }

    @PostMapping
    public Video createVideo(@RequestBody Video video) {
        return videoRepo.save(video);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Video> updateVideo(@PathVariable Long id,
                                             @RequestBody Video video) {
        if (!videoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        video.setId(id);
        return ResponseEntity.ok(videoRepo.save(video));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        if (!videoRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        videoRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
