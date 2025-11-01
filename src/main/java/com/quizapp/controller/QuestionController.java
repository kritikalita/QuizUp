package com.quizapp.controller;

import com.quizapp.dto.TopicUpdateDTO;
import com.quizapp.model.Question;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.service.QuestionService; // <-- ADD THIS
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // <-- ADD THIS

@RestController
@RequestMapping("/api/admin")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService; // <-- ADD THIS

    // This endpoint remains the same (for CREATING new questions)
    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(savedQuestion);
    }

    // This is our login check endpoint, it stays the same
    @GetMapping("/check")
    public ResponseEntity<String> checkAdmin() {
        return ResponseEntity.ok("Admin access verified");
    }

    // --- ADD THE FOLLOWING NEW ENDPOINTS ---

    // GET all questions (to display in a list)
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    // GET a single question by ID (to pre-fill the edit form)
    @GetMapping("/questions/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE an existing question
    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, questionDetails);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE a question
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.noContent().build(); // Success, no content to return
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/topics/{topicName}")
    public ResponseEntity<?> updateTopicInfo(
            @PathVariable String topicName,
            @RequestBody TopicUpdateDTO topicUpdateDTO) {
        try {
            // URL decode topicName just in case it has special chars (though unlikely from our UI)
            String decodedTopicName = java.net.URLDecoder.decode(topicName, java.nio.charset.StandardCharsets.UTF_8.name());
            questionService.updateTopicLogo(decodedTopicName, topicUpdateDTO.getLogoUrl());
            return ResponseEntity.ok().body("Topic logo updated successfully.");
        } catch (Exception e) {
            // Log the error server-side
            System.err.println("Error updating topic logo for " + topicName + ": " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update topic logo.");
        }
    }
}