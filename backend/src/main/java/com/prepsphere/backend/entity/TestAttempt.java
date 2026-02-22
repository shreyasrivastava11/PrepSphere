package com.prepsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "test_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private AppUser user;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(nullable = false)
    private Integer questionCount;

    @Column(nullable = false)
    private Instant startedAt;

    @Column(nullable = false)
    private Instant expiresAt;

    private Instant submittedAt;

    private Integer correctAnswers;

    private Integer wrongAnswers;

    private Integer percentage;

    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status;
}
