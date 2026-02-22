package com.prepsphere.backend.config;

import com.prepsphere.backend.entity.AppUser;
import com.prepsphere.backend.entity.Difficulty;
import com.prepsphere.backend.entity.Question;
import com.prepsphere.backend.entity.Role;
import com.prepsphere.backend.repository.AppUserRepository;
import com.prepsphere.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final List<String> TOPICS = List.of(
            "Java", "JavaScript", "HTML", "CSS", "SQL", "React",
            "Spring Boot", "Node.js", "Linux", "System Design"
    );

    private final AppUserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedQuestions();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("user@prepsphere.com")) {
            userRepository.save(AppUser.builder()
                    .name("PrepSphere User")
                    .email("user@prepsphere.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build());
        }
    }

    private void seedQuestions() {
        List<Question> questionsToSave = new ArrayList<>();
        TOPICS.forEach(topic -> {
            List<Question> existing = new ArrayList<>(questionRepository.findByCategoryIgnoreCase(topic));
            existing.sort(Comparator.comparing(Question::getId));

            for (int i = 1; i <= 15; i++) {
                Question seeded = buildInterviewQuestion(topic, i);
                if (i <= existing.size()) {
                    Question current = existing.get(i - 1);
                    current.setText(seeded.getText());
                    current.setDifficulty(seeded.getDifficulty());
                    current.setOptionA(seeded.getOptionA());
                    current.setOptionB(seeded.getOptionB());
                    current.setOptionC(seeded.getOptionC());
                    current.setOptionD(seeded.getOptionD());
                    current.setCorrectOption(seeded.getCorrectOption());
                    questionsToSave.add(current);
                } else {
                    questionsToSave.add(seeded);
                }
            }
        });

        if (!questionsToSave.isEmpty()) {
            questionRepository.saveAll(questionsToSave);
        }
    }

    private Difficulty pickDifficulty(int i) {
        if (i % 3 == 1) return Difficulty.EASY;
        if (i % 3 == 2) return Difficulty.MEDIUM;
        return Difficulty.HARD;
    }

    private String correctOption(int i) {
        return switch (i % 4) {
            case 0 -> "D";
            case 1 -> "A";
            case 2 -> "B";
            default -> "C";
        };
    }

    private Question buildInterviewQuestion(String topic, int index) {
        Map<String, String[]> concepts = new HashMap<>();
        concepts.put("Java", new String[]{"collection choice", "exception strategy", "JVM memory", "immutability", "multithreading"});
        concepts.put("JavaScript", new String[]{"event loop", "promise chaining", "closure scope", "debounce strategy", "state updates"});
        concepts.put("HTML", new String[]{"semantic tags", "accessibility labels", "form validation", "heading hierarchy", "ARIA usage"});
        concepts.put("CSS", new String[]{"grid layout", "flex alignment", "responsive breakpoints", "specificity control", "stacking context"});
        concepts.put("SQL", new String[]{"join strategy", "index optimization", "transaction safety", "aggregation query", "pagination pattern"});
        concepts.put("React", new String[]{"state management", "effect dependencies", "memoization", "component reusability", "render optimization"});
        concepts.put("Spring Boot", new String[]{"service layering", "exception handling", "JWT security", "transaction boundary", "configuration profiles"});
        concepts.put("Node.js", new String[]{"event loop load", "middleware design", "async error handling", "stream processing", "worker strategy"});
        concepts.put("Linux", new String[]{"permission model", "process diagnostics", "systemd service", "log tracing", "network checks"});
        concepts.put("System Design", new String[]{"caching layer", "queue decoupling", "database choice", "load balancing", "fault tolerance"});

        String[] topicConcepts = concepts.getOrDefault(topic, new String[]{"core design"});
        String concept = topicConcepts[(index - 1) % topicConcepts.length];
        Difficulty difficulty = pickDifficulty(index);

        String text = String.format(
                "You are in a %s interview. For a production scenario focused on %s, what is the best next step?",
                topic,
                concept
        );

        String optionA = "Choose a scalable and maintainable approach with clear trade-offs";
        String optionB = "Apply a quick shortcut without validation or monitoring";
        String optionC = "Ignore constraints and proceed with assumptions only";
        String optionD = "Delay the decision and avoid implementation details";

        return q(topic, difficulty, text, optionA, optionB, optionC, optionD, "A");
    }

    private Question q(String category, Difficulty difficulty, String text,
                       String a, String b, String c, String d, String correct) {
        return Question.builder()
                .category(category)
                .difficulty(difficulty)
                .text(text)
                .optionA(a)
                .optionB(b)
                .optionC(c)
                .optionD(d)
                .correctOption(correct)
                .build();
    }
}
