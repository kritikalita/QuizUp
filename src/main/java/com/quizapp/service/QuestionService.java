package com.quizapp.service;

import com.quizapp.model.Question;
import com.quizapp.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    // Get all questions (for the admin list)
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        existingQuestion.setQuestionText(questionDetails.getQuestionText());
        existingQuestion.setOptionA(questionDetails.getOptionA());
        existingQuestion.setOptionB(questionDetails.getOptionB());
        existingQuestion.setOptionC(questionDetails.getOptionC());
        existingQuestion.setOptionD(questionDetails.getOptionD());
        existingQuestion.setCorrectAnswer(questionDetails.getCorrectAnswer());
        existingQuestion.setTopic(questionDetails.getTopic());
        existingQuestion.setImageUrl(questionDetails.getImageUrl()); // Update the image URL
        existingQuestion.setTopicLogoUrl(questionDetails.getTopicLogoUrl()); // Update topic logo URL

        return questionRepository.save(existingQuestion);
    }

    public void deleteQuestion(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        questionRepository.delete(question);
    }

    @Transactional // Ensure atomicity
    public void updateTopicLogo(String topicName, String newLogoUrl) {
        List<Question> questionsInTopic = questionRepository.findByTopic(topicName);
        if (questionsInTopic.isEmpty()) {
            // Optional: Handle case where topic might not exist (e.g., throw exception or just log)
            System.out.println("No questions found for topic: " + topicName + ". Cannot update logo.");
            return;
        }

        String urlToSave = (newLogoUrl != null && !newLogoUrl.trim().isEmpty()) ? newLogoUrl.trim() : null;

        for (Question question : questionsInTopic) {
            question.setTopicLogoUrl(urlToSave);
        }
        questionRepository.saveAll(questionsInTopic); // Save all updated questions
    }
}