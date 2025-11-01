// src/main/java/com/quizapp/model/TitleReward.java
package com.quizapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "title_rewards",
        uniqueConstraints = @UniqueConstraint(columnNames = {"topic", "levelRequired"})) // Can only have one title per topic/level
@Getter
@Setter
@NoArgsConstructor
public class TitleReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String topic;

    @Min(1)
    @Column(nullable = false)
    private int levelRequired;

    @NotBlank
    @Column(nullable = false)
    private String title; // The title to award, e.g., "Dough Boy"

    public TitleReward(String topic, int levelRequired, String title) {
        this.topic = topic;
        this.levelRequired = levelRequired;
        this.title = title;
    }
}