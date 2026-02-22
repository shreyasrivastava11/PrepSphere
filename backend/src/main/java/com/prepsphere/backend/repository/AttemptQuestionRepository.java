package com.prepsphere.backend.repository;

import com.prepsphere.backend.entity.AttemptQuestion;
import com.prepsphere.backend.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptQuestionRepository extends JpaRepository<AttemptQuestion, Long> {
    List<AttemptQuestion> findByAttemptOrderByQuestionOrderAsc(TestAttempt attempt);
}
