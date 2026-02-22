package com.prepsphere.backend.dto.test;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnswerRequest(
        @NotNull Long questionId,
        @NotBlank String selectedOption
) {
}
