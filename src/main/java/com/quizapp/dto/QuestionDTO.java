package com.quizapp.dto;

import lombok.Data; // Import the Data annotation
import lombok.AllArgsConstructor; // Optional, but useful for your constructor
import lombok.NoArgsConstructor; // Optional, often needed by frameworks

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String imageUrl;
}