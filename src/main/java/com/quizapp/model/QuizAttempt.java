package com.quizapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private QuizUser user;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int totalQuestions;

    @Column(nullable = false)
    private LocalDateTime attemptedAt;

    /**
     * Constructor used by JPA query projection in QuizAttemptRepository.
     */
    public QuizAttempt(QuizUser user, String topic, int score) {
        this.user = user;
        this.topic = topic;
        this.score = score;
        this.totalQuestions = 0;
        this.attemptedAt = null;
        this.id = null;
    }
}