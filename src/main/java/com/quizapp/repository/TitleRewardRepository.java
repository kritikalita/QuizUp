// src/main/java/com/quizapp/repository/TitleRewardRepository.java
package com.quizapp.repository;

import com.quizapp.model.TitleReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TitleRewardRepository extends JpaRepository<TitleReward, Long> {

    // Finds all rewards for a specific topic, ordered by level
    List<TitleReward> findByTopicOrderByLevelRequiredAsc(String topic);

    // Finds the *highest* level reward that a user has achieved for a specific topic
    @Query("""
           SELECT tr
           FROM TitleReward tr
           WHERE tr.topic = :topic
           AND tr.levelRequired <= :level
           ORDER BY tr.levelRequired DESC
           LIMIT 1
           """)
    Optional<TitleReward> findHighestAchievedTitle(@Param("topic") String topic, @Param("level") int level);
}