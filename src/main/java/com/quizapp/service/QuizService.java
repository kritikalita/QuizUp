package com.quizapp.service;

import com.quizapp.dto.*;
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
        List<Question> questionsByTopic = questionRepository.findByTopic(topic);
        // Shuffle the full list
        Collections.shuffle(questionsByTopic);
        // Now, only take the first 7 to send to the frontend
        return questionsByTopic.stream()
                .limit(7) // <-- THIS IS THE FIX. MAKE SURE THIS LINE EXISTS.
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
    public QuizResultDTO calculateScore(List<SubmittedAnswerDTO> answers) {
        // --- NEW SCORING LOGIC ---
        final int TIME_LIMIT_SEC = 10;

        int totalScore = 0;
        int questionsCorrect = 0;
        int maxPossibleScore = 0;

        for (int i = 0; i < answers.size(); i++) {
            SubmittedAnswerDTO answer = answers.get(i);
            Question question = questionRepository.findById(answer.getQuestionId()).orElse(null);

            if (question == null) continue;

            // Check if this is Question 1-6 or the final 7th question
            final boolean isFinalQuestion = (i == (answers.size() - 1));
            final int MAX_POINTS_PER_Q = isFinalQuestion ? 40 : 20;
            final int MIN_POINTS_PER_Q = isFinalQuestion ? 10 : 5;  // Proportional min points
            final double POINTS_PER_SECOND = (double) (MAX_POINTS_PER_Q - MIN_POINTS_PER_Q) / TIME_LIMIT_SEC;

            maxPossibleScore += MAX_POINTS_PER_Q;

            if (answer.getAnswer() != null && question.getCorrectAnswer().equals(answer.getAnswer())) {
                // --- Correct Answer! Calculate points ---
                questionsCorrect++;
                double timeElapsed = Math.min(answer.getTimeElapsed(), TIME_LIMIT_SEC);

                int pointsLost = (int) Math.floor(timeElapsed * POINTS_PER_SECOND);
                int earnedPoints = Math.max(MIN_POINTS_PER_Q, MAX_POINTS_PER_Q - pointsLost);

                totalScore += earnedPoints;
            }
            // else: Wrong answer or timeout (answer.getAnswer() == null), 0 points added
        }
                // --- END NEW SCORING LOGIC ---


        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        QuizUser currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Get topic from the first question
        String topic = "Unknown";
        if (!answers.isEmpty()) {
            topic = questionRepository.findById(answers.get(0).getQuestionId())
                    .map(Question::getTopic)
                    .orElse("Unknown");
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(currentUser);
        attempt.setTopic(topic);
        attempt.setScore(totalScore);
        attempt.setTotalQuestions(answers.size());
        attempt.setAttemptedAt(LocalDateTime.now());
        quizAttemptRepository.save(attempt);

        Set<String> newTitles = xpService.addXp(currentUser, topic, questionsCorrect, answers.size());

        return new QuizResultDTO(totalScore, answers.size(), maxPossibleScore, newTitles);
    }

    public List<LeaderboardEntryDTO> getLeaderboardForTopic(String topicName, int limit) {
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