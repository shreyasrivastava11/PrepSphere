package com.prepsphere.backend.dto.question;

import com.prepsphere.backend.entity.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuestionRequest(
        @NotBlank String text,
        @NotBlank String category,
        @NotNull Difficulty difficulty,
        @NotBlank String optionA,
        @NotBlank String optionB,
        @NotBlank String optionC,
        @NotBlank String optionD,
        @NotBlank String correctOption
) {
}
