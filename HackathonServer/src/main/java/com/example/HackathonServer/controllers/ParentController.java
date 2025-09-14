package com.example.HackathonServer.controllers;

import com.example.HackathonServer.models.Child;
import com.example.HackathonServer.models.Parent;
import com.example.HackathonServer.repos.ChildRepo;
import com.example.HackathonServer.repos.ParentRepo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parent")
public class ParentController {

    @Autowired
    private ParentRepo parentRepo;

    @Autowired
    private ChildRepo childRepo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ParentRequest {
        private String fullName;
        private String username;
        private String email;
        private String password;
        private String dp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class SignInRequest {
        private String email;
        private String password;
    }

    @GetMapping
    public List<Parent> getAllParents() {
        return parentRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parent> getParentById(@PathVariable Long id) {
        return parentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Parent> createParent(@RequestBody ParentRequest request) {
        Parent parent = new Parent();
        parent.setFullName(request.getFullName());
        parent.setUsername(request.getUsername());
        parent.setEmail(request.getEmail());
        parent.setPassword(request.getPassword());
        parent.setDp(request.getDp());
        return ResponseEntity.ok(parentRepo.save(parent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parent> updateParent(@PathVariable Long id, @RequestBody Parent parent) {
        return parentRepo.findById(id)
                .map(existingParent -> {
                    parent.setId(id);
                    return ResponseEntity.ok(parentRepo.save(parent));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        return parentRepo.findById(id)
                .map(parent -> {
                    parentRepo.delete(parent);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/signin")
    public ResponseEntity<Parent> signIn(@RequestBody SignInRequest request) {
        Parent parent = parentRepo.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElse(null);
        return parent != null ? ResponseEntity.ok(parent) : ResponseEntity.notFound().build();
    }


//    @GetMapping("/{parentId}/children")
//    public ResponseEntity<List<Child>> getParentChildren(@PathVariable Long parentId) {
//        return parentRepo.findById(parentId)
//                .map(parent -> ResponseEntity.ok(parent.getChildren()))
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @PostMapping("/{parentId}/children/{childId}")
//    public ResponseEntity<Child> addChildToParent(@PathVariable Long parentId, @PathVariable Long childId) {
//        Parent parent = parentRepo.findById(parentId)
//                .orElseThrow(() -> new RuntimeException("Parent not found"));
//        Child child = childRepo.findById(childId)
//                .orElseThrow(() -> new RuntimeException("Child not found"));
//        child.setParent(parent);
//        return ResponseEntity.ok(childRepo.save(child));
//    }
}
