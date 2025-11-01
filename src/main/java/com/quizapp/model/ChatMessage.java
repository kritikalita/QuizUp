package com.quizapp.model;

public class ChatMessage {

    // --- Define the enum INSIDE the class ---
    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
    // --- End enum definition ---

    private String content;
    private String sender;
    private String recipient;
    private MessageType type; // Use the enum defined above

    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
}