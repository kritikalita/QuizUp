// src/main/java/com/quizapp/service/FollowService.java
package com.quizapp.service;

import com.quizapp.model.QuizUser;
import com.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowService {

    @Autowired
    private UserRepository userRepository;

    // --- REMOVED AchievementService injection ---

    @Transactional
    public void followUser(String usernameToFollow) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        QuizUser currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Current user not found"));
        QuizUser userToFollow = userRepository.findByUsername(usernameToFollow)
                .orElseThrow(() -> new UsernameNotFoundException("User to follow not found"));

        currentUser.getFollowing().add(userToFollow);
        userRepository.save(currentUser);

        // --- REMOVED Achievement check ---
    }

    @Transactional
    public void unfollowUser(String usernameToUnfollow) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        QuizUser currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Current user not found"));
        QuizUser userToUnfollow = userRepository.findByUsername(usernameToUnfollow)
                .orElseThrow(() -> new UsernameNotFoundException("User to unfollow not found"));

        currentUser.getFollowing().remove(userToUnfollow);
        userRepository.save(currentUser);
    }
}