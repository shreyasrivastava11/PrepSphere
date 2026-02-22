package com.prepsphere.backend.service;

import com.prepsphere.backend.dto.question.PagedResponse;
import com.prepsphere.backend.dto.question.QuestionRequest;
import com.prepsphere.backend.dto.question.QuestionResponse;
import com.prepsphere.backend.entity.Difficulty;
import com.prepsphere.backend.entity.Question;
import com.prepsphere.backend.exception.ApiException;
import com.prepsphere.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionResponse create(QuestionRequest request) {
        Question question = toEntity(request);
        return toResponse(questionRepository.save(question));
    }

    public QuestionResponse update(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Question not found"));

        question.setText(request.text());
        question.setCategory(request.category());
        question.setDifficulty(request.difficulty());
        question.setOptionA(request.optionA());
        question.setOptionB(request.optionB());
        question.setOptionC(request.optionC());
        question.setOptionD(request.optionD());
        question.setCorrectOption(request.correctOption());

        return toResponse(questionRepository.save(question));
    }

    public void delete(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Question not found");
        }
        questionRepository.deleteById(id);
    }

    public PagedResponse<QuestionResponse> list(String category, Difficulty difficulty, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Question> result;
        String safeCategory = category == null ? "" : category.trim();

        if (!safeCategory.isBlank() && difficulty != null) {
            result = questionRepository.findByCategoryContainingIgnoreCaseAndDifficulty(safeCategory, difficulty, pageable);
        } else if (!safeCategory.isBlank()) {
            result = questionRepository.findByCategoryContainingIgnoreCase(safeCategory, pageable);
        } else if (difficulty != null) {
            result = questionRepository.findByDifficulty(difficulty, pageable);
        } else {
            result = questionRepository.findAll(pageable);
        }

        List<QuestionResponse> content = result.getContent().stream().map(this::toResponse).toList();
        return new PagedResponse<>(content, result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    public List<Question> findForTest(String category, Difficulty difficulty) {
        if (difficulty == null) {
            return questionRepository.findByCategoryIgnoreCase(category);
        }
        return questionRepository.findByCategoryIgnoreCaseAndDifficulty(category, difficulty);
    }

    private Question toEntity(QuestionRequest request) {
        return Question.builder()
                .text(request.text())
                .category(request.category())
                .difficulty(request.difficulty())
                .optionA(request.optionA())
                .optionB(request.optionB())
                .optionC(request.optionC())
                .optionD(request.optionD())
                .correctOption(request.correctOption().toUpperCase())
                .build();
    }

    private QuestionResponse toResponse(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getText(),
                question.getCategory(),
                question.getDifficulty(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD()
        );
    }
}
