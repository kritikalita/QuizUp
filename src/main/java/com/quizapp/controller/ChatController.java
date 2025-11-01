package com.quizapp.controller;

import com.quizapp.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate; // <-- NEEDED FOR PRIVATE MESSAGES
import org.springframework.stereotype.Controller;
import java.security.Principal; // <-- To get authenticated user

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // <-- Autowire template

    /**
     * Handles sending a private message TO a specific user.
     * The message is sent from /app/private.chat/{recipientUsername}
     * It will be delivered to the recipient's personal queue at /user/{recipientUsername}/queue/private
     */
    @MessageMapping("/private.chat/{recipientUsername}")
    public void sendPrivateMessage(@DestinationVariable String recipientUsername,
                                   @Payload ChatMessage chatMessage,
                                   Principal principal) { // <-- Use Principal to get sender safely

        if (principal == null) {
            logger.error("Cannot send message: User not authenticated.");
            // Optionally send an error back to the sender
            return;
        }
        String senderUsername = principal.getName();
        chatMessage.setSender(senderUsername); // Set sender from authenticated principal
        chatMessage.setRecipient(recipientUsername);
        chatMessage.setType(ChatMessage.MessageType.CHAT);

        logger.info("Sending private message from {} to {}: {}", senderUsername, recipientUsername, chatMessage.getContent());

        // Send message directly to the recipient's user-specific queue
        messagingTemplate.convertAndSendToUser(
                recipientUsername,           // The recipient username
                "/queue/private",            // The specific queue destination
                chatMessage                  // The message payload
        );
    }

    /**
     * Optional: Handle user 'joining' notification (maybe notify specific users later)
     * For now, this might just log or store presence.
     * The simple `addUser` logic might not be needed anymore or needs rethinking for private chat presence.
     * We'll rely on the secured handshake to know who is connected.
     */
    // @MessageMapping("/chat.addUser") // We might remove or change this later
    // public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor, Principal principal) {
    //    if (principal != null) {
    //        logger.info("User connected via WebSocket: {}", principal.getName());
    //        // Maybe store presence or notify friends later
    //        headerAccessor.getSessionAttributes().put("username", principal.getName());
    //    }
    //}

}