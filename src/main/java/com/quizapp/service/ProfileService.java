// src/main/java/com/quizapp/service/ProfileService.java
package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.model.QuizAttempt;
import com.quizapp.model.QuizUser;
import com.quizapp.model.UserTopicProgress;
import com.quizapp.repository.QuizAttemptRepository;
import com.quizapp.repository.UserRepository;
import com.quizapp.repository.UserTopicProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Make sure this is imported

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    @Autowired
    private UserTopicProgressRepository progressRepository;
    @Autowired
    private XPService xpService;

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String username) {
        QuizUser profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        QuizUser currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Current user not found: " + currentUsername));
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByAttemptedAtDesc(profileUser.getId());

        int totalQuizzes = attempts.size();
        double totalScore = attempts.stream()
                .filter(attempt -> attempt.getTotalQuestions() > 0)
                .mapToDouble(attempt -> (double) attempt.getScore() / attempt.getTotalQuestions())
                .sum();
        double averageScore = (totalQuizzes > 0 && totalScore > 0) ? (totalScore / totalQuizzes) * 100 : 0;

        profileUser.getFollowers().size();
        profileUser.getFollowing().size();
        int followersCount = profileUser.getFollowers().size();
        int followingCount = profileUser.getFollowing().size();
        boolean isFollowed = profileUser.getFollowers().contains(currentUser);
        List<FollowUserDTO> followerList = profileUser.getFollowers().stream()
                .map(FollowUserDTO::new)
                .collect(Collectors.toList());
        List<FollowUserDTO> followingList = profileUser.getFollowing().stream()
                .map(FollowUserDTO::new)
                .collect(Collectors.toList());

        UserProfileDTO profileDTO = new UserProfileDTO();
        profileDTO.setUsername(profileUser.getUsername());
        profileDTO.setTotalQuizzesTaken(totalQuizzes);
        profileDTO.setAverageScore(averageScore);
        profileDTO.setFollowersCount(followersCount);
        profileDTO.setFollowingCount(followingCount);
        profileDTO.setFollowedByCurrentUser(isFollowed);
        profileDTO.setFollowers(followerList);
        profileDTO.setFollowing(followingList);
        profileDTO.setProfilePictureUrl(profileUser.getProfilePictureUrl());

        List<UserTopicProgress> progressList = progressRepository.findByUser(profileUser);
        List<UserTopicProgressDTO> progressDTOs = progressList.stream()
                .map(p -> new UserTopicProgressDTO(
                        p.getTopic(),
                        p.getXp(),
                        p.getLevel(),
                        p.getCurrentTitle(),
                        xpService.calculateXpForLevel(p.getLevel() + 1),
                        xpService.calculateXpForLevel(p.getLevel())
                ))
                .collect(Collectors.toList());

        profileDTO.setTopicProgress(progressDTOs);

        return profileDTO;
    }

    public List<UserSearchDTO> searchUsers(String query) {
        List<QuizUser> users = userRepository.findByUsernameContainingIgnoreCase(query);
        return users.stream()
                .map(UserSearchDTO::new)
                .collect(Collectors.toList());
    }

    // --- THIS METHOD WAS MISSING ---
    @Transactional
    public void updateProfilePicture(String username, String fileUrl) {
        QuizUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        user.setProfilePictureUrl(fileUrl);
        userRepository.save(user);
    }
    // --- END OF MISSING METHOD ---
}