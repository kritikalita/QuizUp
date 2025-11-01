package com.quizapp.controller;

import com.quizapp.dto.UserProfileDTO;
import com.quizapp.dto.UserSearchDTO;
import com.quizapp.service.FileStorageService; // <-- ADD
import com.quizapp.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // <-- ADD

import java.util.List;
import java.util.Map; // <-- ADD

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // --- ADD THIS ---
    @Autowired
    private FileStorageService fileStorageService;
    // --- END ADDITION ---

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserProfileDTO profile = profileService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDTO>> searchUsers(@RequestParam String query) {
        List<UserSearchDTO> users = profileService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String username) {
        try {
            UserProfileDTO profile = profileService.getUserProfile(username);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- ADD THIS NEW ENDPOINT ---
    @PostMapping("/me/picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            // 1. Store the file and get its access URL
            String fileUrl = fileStorageService.store(file, username);

            // 2. Update the user's profile with the new URL
            // This call correctly uses TWO arguments
            profileService.updateProfilePicture(username, fileUrl);

            // 3. Return the new URL to the frontend
            return ResponseEntity.ok(Map.of("profilePictureUrl", fileUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload profile picture: " + e.getMessage());
        }
    }
    // --- END ADDITION ---
}