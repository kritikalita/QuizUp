package com.quizapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.util.StringUtils;

@Service
public class FileStorageService {

    private final Path rootLocation;
    private final String uploadDir;

    public FileStorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = uploadDir;
        this.rootLocation = Paths.get(uploadDir);
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String store(MultipartFile file, String username) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Cannot store file with relative path: " + originalFilename);
            }

            // Generate a unique filename: username-timestamp.extension
            String extension = StringUtils.getFilenameExtension(originalFilename);
            String filename = username + "-" + System.currentTimeMillis() + "." + extension;

            Path destinationFile = this.rootLocation.resolve(filename).normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new RuntimeException("Cannot store file outside current directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Return the path to be saved in the database
            // This path will be used by the frontend (e.g., /profile-pics/username-123.jpg)
            return "/" + uploadDir + "/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}