package com.prepsphere.backend.controller;

import com.prepsphere.backend.dto.question.PagedResponse;
import com.prepsphere.backend.dto.question.QuestionRequest;
import com.prepsphere.backend.dto.question.QuestionResponse;
import com.prepsphere.backend.entity.Difficulty;
import com.prepsphere.backend.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public PagedResponse<QuestionResponse> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return questionService.list(category, difficulty, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public QuestionResponse create(@Valid @RequestBody QuestionRequest request) {
        return questionService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public QuestionResponse update(@PathVariable Long id, @Valid @RequestBody QuestionRequest request) {
        return questionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public void delete(@PathVariable Long id) {
        questionService.delete(id);
    }
}
