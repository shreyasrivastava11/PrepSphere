package com.prepsphere.backend.repository;

import com.prepsphere.backend.entity.TestAnswer;
import com.prepsphere.backend.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestAnswerRepository extends JpaRepository<TestAnswer, Long> {
    List<TestAnswer> findByAttempt(TestAttempt attempt);
}
