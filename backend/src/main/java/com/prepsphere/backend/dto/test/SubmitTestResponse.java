package com.prepsphere.backend.dto.test;

import java.time.Instant;
import java.util.List;

public record SubmitTestResponse(
        Long attemptId,
        Integer correctAnswers,
        Integer wrongAnswers,
        Integer score,
        Integer percentage,
        Instant submittedAt,
        List<SubmitTestReviewItem> review
) {
}
