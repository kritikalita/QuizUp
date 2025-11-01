// src/main/java/com/quizapp/model/UserTopicProgress.java
package com.quizapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_topic_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic"})) // User can only have one entry per topic
@Getter
@Setter
@NoArgsConstructor
public class UserTopicProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private QuizUser user;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int level = 1;

    @Column(nullable = true)
    private String currentTitle; // e.g., "Dough Boy"

    // Constructor for new progress
    public UserTopicProgress(QuizUser user, String topic, int xp, int level, String currentTitle) {
        this.user = user;
        this.topic = topic;
        this.xp = xp;
        this.level = level;
        this.currentTitle = currentTitle;
    }
}