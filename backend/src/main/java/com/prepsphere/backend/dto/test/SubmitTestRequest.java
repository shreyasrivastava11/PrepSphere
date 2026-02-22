package com.prepsphere.backend.dto.test;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record SubmitTestRequest(
        @Valid @NotEmpty List<AnswerRequest> answers
) {
}
