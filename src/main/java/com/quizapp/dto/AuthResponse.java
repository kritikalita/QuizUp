package com.quizapp.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String tokenType = "Bearer";

    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getTokenType() {
        return tokenType;
    }
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
