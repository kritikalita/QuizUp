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
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private XPService xpService;

    public List<QuestionDTO> getQuizQuestionsByTopic(String topic) {
        List<Question> questionsByTopic = questionRepository.findByTopic(topic);
        Collections.shuffle(questionsByTopic);

        // GUARD 1: Limit fetch to 7 questions max
        return questionsByTopic.stream()
                .limit(7)
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
        final int TIME_LIMIT_SEC = 10;

        int totalScore = 0;
        int questionsCorrect = 0;
        int maxPossibleScore = 0;

        // GUARD 2: STRICTLY limit scoring to the first 7 answers only.
        // unexpected extra answers from the frontend are ignored.
        int answersToProcess = Math.min(answers.size(), 7);

        for (int i = 0; i < answersToProcess; i++) {
            SubmittedAnswerDTO answer = answers.get(i);
            Question question = questionRepository.findById(answer.getQuestionId()).orElse(null);

            if (question == null) continue;

            // GUARD 3: Bonus ONLY applies to the 7th question (index 6).
            // 5-question quizzes will NEVER get a bonus.
            final boolean isBonusQuestion = (i == 6);

            final int MAX_POINTS_PER_Q = isBonusQuestion ? 40 : 20;
            final int MIN_POINTS_PER_Q = isBonusQuestion ? 10 : 5;
            // Protect against division by zero if TIME_LIMIT_SEC is changed later
            final double POINTS_PER_SECOND = (TIME_LIMIT_SEC > 0) ? (double) (MAX_POINTS_PER_Q - MIN_POINTS_PER_Q) / TIME_LIMIT_SEC : 0;

            maxPossibleScore += MAX_POINTS_PER_Q;

            if (answer.getAnswer() != null && question.getCorrectAnswer().equals(answer.getAnswer())) {
                questionsCorrect++;
                // Ensure time elapsed is within valid bounds [0, 10]
                double timeElapsed = Math.max(0, Math.min(answer.getTimeElapsed(), TIME_LIMIT_SEC));

                int pointsLost = (int) Math.floor(timeElapsed * POINTS_PER_SECOND);
                int earnedPoints = Math.max(MIN_POINTS_PER_Q, MAX_POINTS_PER_Q - pointsLost);

                totalScore += earnedPoints;
            }
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        QuizUser currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

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
        attempt.setTotalQuestions(answersToProcess); // Use the processed count, not the raw size
        attempt.setAttemptedAt(LocalDateTime.now());
        quizAttemptRepository.save(attempt);

        Set<String> newTitles = xpService.addXp(currentUser, topic, questionsCorrect, answersToProcess);

        return new QuizResultDTO(totalScore, answersToProcess, maxPossibleScore, newTitles);
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