// src/main/java/com/quizapp/service/XPService.java
package com.quizapp.service;

import com.quizapp.model.QuizUser;
import com.quizapp.model.TitleReward;
import com.quizapp.model.UserTopicProgress;
import com.quizapp.repository.TitleRewardRepository;
import com.quizapp.repository.UserTopicProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@Service
public class XPService {

    @Autowired
    private UserTopicProgressRepository progressRepository;

    @Autowired // <-- ADD
    private TitleRewardRepository titleRewardRepository; // <-- ADD

    /**
     * Calculates the *total* XP required to reach a specific level.
     * Level 1: 0 XP
     * Level 2: 100 XP
     * Level 3: 282 XP
     * Level 4: 520 XP
     * Level 5: 800 XP
     * Level 10: 2593 XP
     */
    public int calculateXpForLevel(int level) {
        if (level <= 1) return 0;
        // Using a progressive formula: 100 * (level-1)^1.5
        return (int) Math.floor(100 * Math.pow(level - 1, 1.5));
    }

    /**
     * Finds the corresponding level for a given total XP.
     */
    public int getLevelForXp(int xp) {
        int level = 1;
        // Keep checking the *next* level's requirement
        while (xp >= calculateXpForLevel(level + 1)) {
            level++;
            if (level > 99) return 99; // Cap at level 99
        }
        return level;
    }

    /**
     * Gets the highest title unlocked for a given topic and level.
     */
    private String getUnlockedTitle(String topic, int level) {
        // Use the new repository method
        Optional<TitleReward> reward = titleRewardRepository.findHighestAchievedTitle(topic, level);

        // Return the title if found, otherwise null
        return reward.map(TitleReward::getTitle).orElse(null);
    }

    /**
     * Adds XP to a user for a specific topic and handles level ups/title unlocks.
     * @return A Set of newly unlocked titles (can be empty).
     */
    @Transactional
    public Set<String> addXp(QuizUser user, String topic, int score, int totalQuestions) {
        Set<String> newTitles = new HashSet<>();
        if (totalQuestions == 0) return newTitles;

        int xpGained = (score * 10) + 5;
        if (score == totalQuestions) {
            xpGained += 25;
        }

        UserTopicProgress progress = progressRepository.findByUserAndTopic(user, topic)
                .orElse(new UserTopicProgress(user, topic, 0, 1, null));

        int oldLevel = progress.getLevel();
        String oldTitle = progress.getCurrentTitle();

        int newXp = progress.getXp() + xpGained;
        int newLevel = getLevelForXp(newXp);

        progress.setXp(newXp);
        progress.setLevel(newLevel);

        if (newLevel > oldLevel) {
            // Level up! Check for new titles.
            String newTitle = getUnlockedTitle(topic, newLevel);

            if (newTitle != null && !newTitle.equals(oldTitle)) {
                progress.setCurrentTitle(newTitle);
                newTitles.add(newTitle);
            }
        }

        progressRepository.save(progress);
        return newTitles;
    }
}