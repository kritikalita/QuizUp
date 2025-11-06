package com.quizapp.controller;

import com.quizapp.dto.*;
import com.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // --- ADD THIS NEW ENDPOINT ---
    // Fetches a list of all available topics
    @GetMapping("/topics")
    public ResponseEntity<List<TopicInfoDTO>> getTopics() { // <-- Change return type
        return ResponseEntity.ok(quizService.getAllTopics());
    }
    // --- THIS ENDPOINT IS NOW CHANGED ---
    // It fetches questions for a specific topic
    @GetMapping("/topic/{topicName}")
    public ResponseEntity<List<QuestionDTO>> getQuizByTopic(@PathVariable String topicName) {
        return ResponseEntity.ok(quizService.getQuizQuestionsByTopic(topicName));
    }

    // This endpoint remains the same
    @PostMapping("/submit")
    public ResponseEntity<QuizResultDTO> submitQuiz(@RequestBody List<SubmittedAnswerDTO> answers) { // <-- USE THE NEW DTO
        return ResponseEntity.ok(quizService.calculateScore(answers));
    }

    @GetMapping("/leaderboard/{topicName}")
    public ResponseEntity<List<LeaderboardEntryDTO>> getTopicLeaderboard(
            @PathVariable String topicName,
            @RequestParam(defaultValue = "10") int limit) { // Default to top 10
        List<LeaderboardEntryDTO> leaderboard = quizService.getLeaderboardForTopic(topicName, limit);
        return ResponseEntity.ok(leaderboard);
    }
}
