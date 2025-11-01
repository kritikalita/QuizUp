// src/main/java/com/quizapp/dto/UserTopicProgressDTO.java
package com.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserTopicProgressDTO {
    private String topic;
    private int xp;
    private int level;
    private String currentTitle;
    private int xpToNextLevel; // XP needed to reach the *next* level (e.g., Level 3's total XP)
    private int xpForCurrentLevel; // XP needed to reach the *current* level (e.g., Level 2's total XP)
}