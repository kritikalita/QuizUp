package com.quizapp.repository;

import com.quizapp.model.QuizAttempt;
import com.quizapp.model.QuizUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);

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
    List<QuizAttempt> findTopScoresByTopic(@Param("topicName") String topicName);

}