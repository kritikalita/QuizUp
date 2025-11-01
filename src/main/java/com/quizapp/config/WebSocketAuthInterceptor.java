package com.quizapp.config;

import com.quizapp.service.CustomUserDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketAuthInterceptor.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Check if it's a CONNECT command
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Attempt to retrieve the Authorization header (sent by the client)
            List<String> authorization = accessor.getNativeHeader("Authorization");
            logger.debug("Authorization header: {}", authorization);

            String jwt = null;
            if (authorization != null && !authorization.isEmpty()) {
                String bearerToken = authorization.get(0);
                if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                    jwt = bearerToken.substring(7);
                }
            }

            if (jwt != null && tokenProvider.validateToken(jwt)) {
                try {
                    String username = tokenProvider.getUsernameFromJWT(jwt);
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                    // Create an Authentication object
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    // Associate the user with the STOMP session
                    accessor.setUser(authentication);
                    logger.info("Authenticated WebSocket CONNECT for user: {}", username);
                } catch (Exception e) {
                    logger.error("WebSocket authentication failed: {}", e.getMessage());
                    // Optionally prevent connection explicitly here, though not setting user might be enough
                }
            } else {
                logger.warn("WebSocket CONNECT without valid JWT token.");
                // Connection will likely proceed but without an authenticated user principal
            }
        }
        return message;
    }
}