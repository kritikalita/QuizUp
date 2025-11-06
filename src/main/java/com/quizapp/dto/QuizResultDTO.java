package com.quizapp.dto;

import java.util.Set;

public class QuizResultDTO {
    private int score;
    private int totalQuestions;
    private int maxScore;
    private Set<String> newTitles;

    // --- CONSTRUCTOR ---
    public QuizResultDTO(int score, int totalQuestions, int maxScore, Set<String> newTitles) {
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.maxScore = maxScore;
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
    public Set<String> getNewTitles() {
        return newTitles;
    }
    public void setNewTitles(Set<String> newTitles) {this.newTitles = newTitles;}
    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }

}