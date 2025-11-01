package com.quizapp.dto;

import com.quizapp.model.QuizAttempt;
import java.time.LocalDateTime;

public class QuizAttemptDTO {

    private Long id;
    private String topic;
    private int score;
    private int totalQuestions;
    private LocalDateTime attemptedAt;

    // Constructor to convert Entity to DTO
    public QuizAttemptDTO(QuizAttempt attempt) {
        this.id = attempt.getId();
        this.topic = attempt.getTopic();
        this.score = attempt.getScore();
        this.totalQuestions = attempt.getTotalQuestions();
        this.attemptedAt = attempt.getAttemptedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public LocalDateTime getAttemptedAt() { return attemptedAt; }
    public void setAttemptedAt(LocalDateTime attemptedAt) { this.attemptedAt = attemptedAt; }
}