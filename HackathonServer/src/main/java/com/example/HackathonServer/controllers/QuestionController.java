package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Question;
import com.example.HackathonServer.models.Video;
import com.example.HackathonServer.repos.QuestionRepo;
import com.example.HackathonServer.repos.VideoRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/video/{videoId}/question")
public class QuestionController {

    @Autowired
    private QuestionRepo questionRepo;
    @Autowired
    private VideoRepo videoRepo;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.of(questionRepo.findById(id));
    }

    @PostMapping
    public Question createQuestion(@PathVariable Long videoId,
                                   @RequestBody Question question)
    {
        Video video = videoRepo.findById(videoId).orElseThrow(EntityNotFoundException::new);
        Question q = questionRepo.save(question);
        video.getQuestions().add(q);
        videoRepo.save(video);
        return q;
    }

    @PostMapping("/question-set")
    public List<Question> createQuestionSet(@PathVariable Long videoId,
                                   @RequestBody List<Question> question)
    {
        Video video = videoRepo.findById(videoId).orElseThrow(EntityNotFoundException::new);
        List<Question>questionList = new ArrayList<>();
        for(Question q : question) {
            q.setVideo(video);
            Question saved = questionRepo.save(q);
            questionList.add(saved);
        }
        video.setQuestions(questionList);
        videoRepo.save(video);
        return question;
    }


    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id,
                                                   @PathVariable Long videoId,
                                                   @RequestBody Question question) {
        if (!questionRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        question.setId(id);
        return ResponseEntity.ok(questionRepo.save(question));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (!questionRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        questionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
