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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/parent/{parentId}/child")
public class ChildController {

    @Autowired
    private ChildRepo childRepo;
    @Autowired
    private ParentRepo parentRepo;
    

    @GetMapping
    public ResponseEntity<List<Child>> getAllChildren(@PathVariable Long parentId) {
        return ResponseEntity.ok(childRepo.findByParentId(parentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Child> getChildById(@PathVariable Long parentId, @PathVariable Long id) {
        Optional<Child> child = childRepo.findByIdAndParentId(id, parentId);
        if (child.get() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(child.get());
                
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor

    private static class ChildRequest {
        private String fullName;
        private LocalDate dateOfBirth;
    }

    @PostMapping
    public ResponseEntity<Child> createChild(@PathVariable Long parentId, 
                                             @RequestBody ChildRequest child) {
        Parent parent = parentRepo.findById(parentId).orElse(null);
        if (parent == null) {
            return ResponseEntity.notFound().build();
        }
        Child newChild = new Child();
        newChild.setFullName(child.fullName);
        newChild.setDateOfBirth(child.dateOfBirth);
        newChild.setParent(parent);
        Child savedChild = childRepo.save(newChild);
        return ResponseEntity.ok(savedChild);
    }
    
    
    @PutMapping("/{id}")
    public ResponseEntity<Child> updateChild(@PathVariable Long parentId, @PathVariable Long id, @RequestBody Child child) {
        Optional<Child> existingChild = childRepo.findByIdAndParentId(id, parentId);
        if (existingChild.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        child.setId(id);
        child.setParent(existingChild.get().getParent());
        Child savedChild = childRepo.save(child);
        return ResponseEntity.ok(savedChild);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable Long parentId, @PathVariable Long id) {
        Optional<Child> child = childRepo.findByIdAndParentId(id, parentId);
        if (child.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        childRepo.delete(child.get());
        return ResponseEntity.ok().build();
    }
}
