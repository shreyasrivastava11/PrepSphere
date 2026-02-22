package com.prepsphere.backend.dto.test;

import com.prepsphere.backend.entity.Difficulty;

public record QuestionForAttemptResponse(
        Long id,
        String text,
        String category,
        Difficulty difficulty,
        String optionA,
        String optionB,
        String optionC,
        String optionD,
        Integer order
) {
}
