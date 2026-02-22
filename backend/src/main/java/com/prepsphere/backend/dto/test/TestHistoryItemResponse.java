package com.prepsphere.backend.dto.test;

import java.time.Instant;

public record TestHistoryItemResponse(
        Long attemptId,
        String category,
        Integer totalQuestions,
        Integer correctAnswers,
        Integer wrongAnswers,
        Integer score,
        Integer percentage,
        Instant startedAt,
        Instant submittedAt,
        String status
) {
}
