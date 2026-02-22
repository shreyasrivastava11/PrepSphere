package com.prepsphere.backend.controller;

import com.prepsphere.backend.dto.test.*;
import com.prepsphere.backend.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping("/start")
    @PreAuthorize("hasRole('USER')")
    public StartTestResponse start(@Valid @RequestBody StartTestRequest request) {
        return testService.startTest(request);
    }

    @PostMapping("/{attemptId}/submit")
    @PreAuthorize("hasRole('USER')")
    public SubmitTestResponse submit(@PathVariable Long attemptId, @Valid @RequestBody SubmitTestRequest request) {
        return testService.submitTest(attemptId, request);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public List<TestHistoryItemResponse> history() {
        return testService.getHistory();
    }

    @GetMapping("/best-score")
    @PreAuthorize("hasRole('USER')")
    public BestScoreResponse bestScore() {
        return testService.getBestScore();
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('USER')")
    public AnalyticsResponse analytics() {
        return testService.getAnalytics();
    }

    @GetMapping("/latest")
    @PreAuthorize("hasRole('USER')")
    public SubmitTestResponse latest() {
        return testService.getLatestResult();
    }
}
