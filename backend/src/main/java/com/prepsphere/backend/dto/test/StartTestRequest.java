package com.prepsphere.backend.dto.test;

import com.prepsphere.backend.entity.Difficulty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StartTestRequest(
        @NotBlank String category,
        Difficulty difficulty,
        @NotNull @Min(1) @Max(25) Integer questionCount,
        @NotNull @Min(1) @Max(120) Integer durationMinutes
) {
}
