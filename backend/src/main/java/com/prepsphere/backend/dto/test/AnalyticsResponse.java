package com.prepsphere.backend.dto.test;

import java.util.List;

public record AnalyticsResponse(
        Integer totalTests,
        Integer averageScore,
        Integer bestScore,
        String weakCategory,
        List<TrendPointResponse> trend
) {
}
