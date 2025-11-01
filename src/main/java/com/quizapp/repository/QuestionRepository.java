package com.quizapp.repository;

import com.quizapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // --- ADD THIS METHOD ---
    // Finds all questions belonging to a specific topic
    List<Question> findByTopic(String topic);

    // --- AND ADD THIS METHOD ---
    // Returns a unique list of all topics in the database
    @Query("SELECT DISTINCT q.topic FROM Question q")
    List<String> findDistinctTopics();
}