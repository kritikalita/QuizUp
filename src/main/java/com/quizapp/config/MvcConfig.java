package com.quizapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String resourcePath = Paths.get(uploadDir).toFile().getAbsolutePath();

        registry.addResourceHandler("/" + uploadDir + "/**")
                // --- THIS LINE IS FIXED ---
                // Removed the extra slash after "file:"
                .addResourceLocations("file:" + resourcePath + "/");
    }
}