package com.quizapp.dto;

import lombok.AllArgsConstructor; // Using Lombok
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor // Lombok
public class TopicInfoDTO {
    private String name;
    private String logoUrl; // Can be null if no logo provided for this topic
}