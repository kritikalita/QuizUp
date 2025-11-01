// src/main/java/com/quizapp/service/QuizService.java
package com.quizapp.service;

import com.quizapp.dto.LeaderboardEntryDTO;
import com.quizapp.dto.QuestionDTO;
import com.quizapp.dto.QuizResultDTO;
import com.quizapp.dto.TopicInfoDTO;
import com.quizapp.model.Question;
import com.quizapp.model.QuizAttempt;
import com.quizapp.model.QuizUser;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.repository.QuizAttemptRepository;
import com.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set; // This import might be unused now, which is fine
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    // --- REMOVED AchievementService injection ---

    @Autowired
    private XPService xpService;

    public List<QuestionDTO> getQuizQuestionsByTopic(String topic) {
        // ... (method content remains the same) ...
        List<Question> questionsByTopic = questionRepository.findByTopic(topic);
        Collections.shuffle(questionsByTopic);
        return questionsByTopic.stream()
                .map(question -> new QuestionDTO(
                        question.getId(),
                        question.getQuestionText(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC(),
                        question.getOptionD(),
                        question.getImageUrl()
                ))
                .collect(Collectors.toList());
    }

    public List<TopicInfoDTO> getAllTopics() {
        // ... (method content remains the same) ...
        List<Question> allQuestions = questionRepository.findAll();
        Map<String, String> topicToLogoMap = allQuestions.stream()
                .map(q -> new TopicInfoDTO(q.getTopic(), q.getTopicLogoUrl()))
                .filter(t -> t.getName() != null && !t.getName().trim().isEmpty())
                .collect(Collectors.toMap(
                        TopicInfoDTO::getName,
                        t -> t.getLogoUrl() != null ? t.getLogoUrl() : "",
                        (existingLogo, newLogo) -> existingLogo != null && !existingLogo.isEmpty() ? existingLogo : newLogo
                ));
        return topicToLogoMap.entrySet().stream()
                .map(entry -> new TopicInfoDTO(entry.getKey(), entry.getValue().isEmpty() ? null : entry.getValue()))
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizResultDTO calculateScore(Map<Long, String> answers) {
        int score = 0;
        List<Question> questions = questionRepository.findAllById(answers.keySet());

        for (Question question : questions) {
            String correctAnswer = question.getCorrectAnswer();
            String userAnswer = answers.get(question.getId());
            if (correctAnswer != null && correctAnswer.equals(userAnswer)) {
                score++;
            }
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        QuizUser currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String topic = questions.isEmpty() ? "Unknown" : questions.get(0).getTopic();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(currentUser);
        attempt.setTopic(topic);
        attempt.setScore(score);
        attempt.setTotalQuestions(questions.size());
        attempt.setAttemptedAt(LocalDateTime.now());
        quizAttemptRepository.save(attempt);

        // --- REMOVED Achievement check ---

        // Add XP and check for level-ups/titles
        Set<String> newTitles = xpService.addXp(currentUser, topic, score, questions.size());

        // --- MODIFIED RETURN (removed newAchievements) ---
        return new QuizResultDTO(score, questions.size(), newTitles);
    }

    public List<LeaderboardEntryDTO> getLeaderboardForTopic(String topicName, int limit) {
        // ... (method content remains the same) ...
        List<QuizAttempt> topAttempts = quizAttemptRepository.findTopScoresByTopic(topicName);
        return topAttempts.stream()
                .limit(limit)
                .map(attempt -> new LeaderboardEntryDTO(
                        attempt.getUser().getUsername(),
                        attempt.getScore(),
                        attempt.getUser().getProfilePictureUrl()
                ))
                .collect(Collectors.toList());
    }
}