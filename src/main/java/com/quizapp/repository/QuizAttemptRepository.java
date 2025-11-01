//package com.quizapp.repository;
//
//import com.quizapp.model.QuizAttempt;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
//
//    // Finds all attempts for a given user ID, ordered from newest to oldest
//    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);
//}


// src/main/java/com/quizapp/repository/QuizAttemptRepository.java
package com.quizapp.repository;

import com.quizapp.model.QuizAttempt;
import com.quizapp.model.QuizUser; // <-- Ensure QuizUser is imported if needed for constructor
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
// import org.springframework.data.domain.Pageable; // <-- Import if using Pageable for limiting results in DB query
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    // Finds all attempts for a given user ID, ordered from newest to oldest
    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);

    // Finds the highest score for each user within a specific topic
    @Query("""
           SELECT new com.quizapp.model.QuizAttempt(
               qa.user,
               qa.topic,
               MAX(qa.score)
           )
           FROM QuizAttempt qa
           WHERE qa.topic = :topicName
           GROUP BY qa.user, qa.topic
           ORDER BY MAX(qa.score) DESC
           """)
    // Note: This relies on a constructor QuizAttempt(QuizUser user, String topic, int score).
    // If that constructor doesn't exist, change return type to List<Object[]>
    // and map manually in the QuizService.
    List<QuizAttempt> findTopScoresByTopic(@Param("topicName") String topicName);
    // Alternative with Pageable:
    // List<QuizAttempt> findTopScoresByTopic(@Param("topicName") String topicName, Pageable pageable);

}
