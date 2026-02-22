package com.prepsphere.backend.dto.test;

public record SubmitTestReviewItem(
        Long questionId,
        Integer order,
        String question,
        String selectedOption,
        String correctOption,
        boolean correct
) {
}
