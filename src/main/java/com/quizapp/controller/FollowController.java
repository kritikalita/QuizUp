package com.quizapp.controller;

import com.quizapp.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{username}")
    public ResponseEntity<?> followUser(@PathVariable String username) {
        try {
            followService.followUser(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<?> unfollowUser(@PathVariable String username) {
        try {
            followService.unfollowUser(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}