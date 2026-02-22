package com.prepsphere.backend.dto.question;

import com.prepsphere.backend.entity.Difficulty;

public record QuestionResponse(
        Long id,
        String text,
        String category,
        Difficulty difficulty,
        String optionA,
        String optionB,
        String optionC,
        String optionD
) {
}
