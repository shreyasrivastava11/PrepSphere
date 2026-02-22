package com.prepsphere.backend.dto.test;

import java.time.Instant;
import java.util.List;

public record StartTestResponse(
        Long attemptId,
        String category,
        Integer durationMinutes,
        Instant startedAt,
        Instant expiresAt,
        List<QuestionForAttemptResponse> questions
) {
}
