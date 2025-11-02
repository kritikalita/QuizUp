// src/main/java/com/quizapp/dto/UserProfileDTO.java
package com.quizapp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileDTO {

    private String username;
    private int totalQuizzesTaken;
    private double averageScore;

    private int followersCount;
    private int followingCount;
    private boolean isFollowedByCurrentUser;
    private List<FollowUserDTO> followers;
    private List<FollowUserDTO> following;
    private String profilePictureUrl;
    private String countryCode;

    private List<UserTopicProgressDTO> topicProgress;
}