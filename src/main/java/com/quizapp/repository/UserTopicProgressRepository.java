// src/main/java/com/quizapp/repository/UserTopicProgressRepository.java
package com.quizapp.repository;

import com.quizapp.model.UserTopicProgress;
import com.quizapp.model.QuizUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTopicProgressRepository extends JpaRepository<UserTopicProgress, Long> {

    Optional<UserTopicProgress> findByUserAndTopic(QuizUser user, String topic);

    List<UserTopicProgress> findByUser(QuizUser user);
}