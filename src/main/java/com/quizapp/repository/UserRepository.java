package com.quizapp.repository;

import com.quizapp.model.QuizUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<QuizUser, Long> { // <-- CORRECT line

    Optional<QuizUser> findByUsername(String username);
    Boolean existsByUsername(String username);
    // Finds users where the username contains the query string (case-insensitive)
    List<QuizUser> findByUsernameContainingIgnoreCase(String username);
}










