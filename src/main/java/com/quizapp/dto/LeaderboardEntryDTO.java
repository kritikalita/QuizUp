package com.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private String username;
    private int highScore; // User's highest score for this topic
    private String profilePictureUrl; // Optional: To display avatars
}