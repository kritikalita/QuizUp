package com.quizapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmittedAnswerDTO {
    // We need to know which question this answer is for
    private Long questionId;

    // The option selected, e.g., "A", "B", or null for timeout
    private String answer;

    // How many seconds elapsed before answering (e.g., 2.5)
    private double timeElapsed;
}