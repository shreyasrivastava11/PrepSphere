package com.prepsphere.backend.repository;

import com.prepsphere.backend.entity.Difficulty;
import com.prepsphere.backend.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    Page<Question> findByCategoryContainingIgnoreCaseAndDifficulty(String category, Difficulty difficulty, Pageable pageable);
    Page<Question> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
    Page<Question> findByDifficulty(Difficulty difficulty, Pageable pageable);

    List<Question> findByCategoryIgnoreCase(String category);
    List<Question> findByCategoryIgnoreCaseAndDifficulty(String category, Difficulty difficulty);
}
