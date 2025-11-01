//package com.quizapp.model;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "quiz_attempts")
//public class QuizAttempt {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private QuizUser user;
//
//    @Column(nullable = false)
//    private String topic;
//
//    @Column(nullable = false)
//    private int score;
//
//    @Column(nullable = false)
//    private int totalQuestions;
//
//    @Column(nullable = false)
//    private LocalDateTime attemptedAt;
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//    public void setId(Long id) {
//        this.id = id;
//    }
//    public QuizUser getUser() {
//        return user;
//    }
//    public void setUser(QuizUser user) {
//        this.user = user;
//    }
//    public String getTopic() {
//        return topic;
//    }
//    public void setTopic(String topic) {
//        this.topic = topic;
//    }
//    public int getScore() {
//        return score;
//    }
//    public void setScore(int score) {
//        this.score = score;
//    }
//    public int getTotalQuestions() {
//        return totalQuestions;
//    }
//    public void setTotalQuestions(int totalQuestions) {
//        this.totalQuestions = totalQuestions;
//    }
//    public LocalDateTime getAttemptedAt() {
//        return attemptedAt;
//    }
//    public void setAttemptedAt(LocalDateTime attemptedAt) {
//        this.attemptedAt = attemptedAt;
//    }
//
//}




// src/main/java/com/quizapp/model/QuizAttempt.java
package com.quizapp.model;

import jakarta.persistence.*;
import lombok.Getter; // Using Lombok for boilerplate
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

    @ManyToOne(fetch = FetchType.LAZY) // Lazy fetch is usually good practice here
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

    // --- ADDED CONSTRUCTOR FOR JPA PROJECTION ---
    /**
     * Constructor used by JPA query projection in QuizAttemptRepository.
     * @param user The user associated with the attempt.
     * @param topic The topic of the quiz attempt.
     * @param score The score achieved (in this case, the MAX score from the query).
     */
    public QuizAttempt(QuizUser user, String topic, int score) {
        this.user = user;
        this.topic = topic;
        this.score = score;
        // Initialize other fields to default/null as they aren't part of the projection
        this.totalQuestions = 0; // Or fetch/calculate if needed, but complicates the query
        this.attemptedAt = null;
        this.id = null; // ID is not part of the GROUP BY projection
    }


}