// src/main/java/com/quizapp/controller/TitleRewardController.java
package com.quizapp.controller;

import com.quizapp.model.TitleReward;
import com.quizapp.repository.TitleRewardRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException; // <-- ADD THIS
import org.springframework.http.HttpStatus; // <-- ADD THIS
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/titles")
@PreAuthorize("hasRole('ADMIN')")
public class TitleRewardController {

    @Autowired
    private TitleRewardRepository titleRewardRepository;

    // --- ADD THIS EXCEPTION HANDLER ---
    // This catches the "duplicate key" error and returns a friendly message
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        // You could make this check more specific, but this is a good general catch
        if (e.getMessage().contains("uk71068ssy6hmrq7lmea75iqmvv")) { // Use your constraint name
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // 409 Conflict
                    .body("A reward for this topic and level already exists.");
        }
        // Return a generic bad request for other integrity issues
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Database integrity error.");
    }
    // --- END ADDITION ---

    // GET all title rewards
    @GetMapping
    public ResponseEntity<List<TitleReward>> getAllTitleRewards() {
        List<TitleReward> rewards = titleRewardRepository.findAll();
        return ResponseEntity.ok(rewards);
    }

    // POST a new title reward
    @PostMapping
    public ResponseEntity<TitleReward> createTitleReward(@Valid @RequestBody TitleReward titleReward) {
        TitleReward savedReward = titleRewardRepository.save(titleReward);
        return ResponseEntity.ok(savedReward);
    }

    // PUT (Update) an existing title reward
    // --- THIS IS THE SIMPLIFIED LOGIC FOR FIX 1 ---
    @PutMapping("/{id}")
    public ResponseEntity<TitleReward> updateTitleReward(@PathVariable Long id, @Valid @RequestBody TitleReward rewardDetails) {
        Optional<TitleReward> optionalReward = titleRewardRepository.findById(id);

        if (optionalReward.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TitleReward reward = optionalReward.get();
        reward.setTopic(rewardDetails.getTopic());
        reward.setLevelRequired(rewardDetails.getLevelRequired());
        reward.setTitle(rewardDetails.getTitle());
        TitleReward updatedReward = titleRewardRepository.save(reward);
        return ResponseEntity.ok(updatedReward);
    }

    // DELETE a title reward
    // --- THIS IS THE SIMPLIFIED LOGIC FOR FIX 1 ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTitleReward(@PathVariable Long id) {
        Optional<TitleReward> optionalReward = titleRewardRepository.findById(id);

        if (optionalReward.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        titleRewardRepository.delete(optionalReward.get());
        return ResponseEntity.noContent().build();
    }
}