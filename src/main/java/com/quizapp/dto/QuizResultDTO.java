// src/main/java/com/quizapp/dto/QuizResultDTO.java
package com.quizapp.dto;

import java.util.Set;

public class QuizResultDTO {
    private int score;
    private int totalQuestions;
    // --- REMOVED newAchievements ---
    private Set<String> newTitles;

    // --- MODIFIED CONSTRUCTOR ---
    public QuizResultDTO(int score, int totalQuestions, Set<String> newTitles) {
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.newTitles = newTitles;
    }

    // Getters and Setters
    public int getScore() {
        return score;
    }
    public void setScore(int score) {
        this.score = score;
    }
    public int getTotalQuestions() {
        return totalQuestions;
    }
    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    // --- REMOVED getNewAchievements / setNewAchievements ---

    public Set<String> getNewTitles() {
        return newTitles;
    }
    public void setNewTitles(Set<String> newTitles) {
        this.newTitles = newTitles;
    }
}