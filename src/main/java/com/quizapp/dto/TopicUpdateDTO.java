package com.quizapp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class TopicUpdateDTO {
    private String logoUrl; // Can be null or empty string to remove logo
}