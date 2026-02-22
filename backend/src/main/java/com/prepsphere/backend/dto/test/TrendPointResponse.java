package com.prepsphere.backend.dto.test;

import java.time.Instant;

public record TrendPointResponse(
        Instant date,
        Integer percentage
) {
}
