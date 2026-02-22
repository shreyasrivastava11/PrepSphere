package com.prepsphere.backend.repository;

import com.prepsphere.backend.entity.AppUser;
import com.prepsphere.backend.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByUserOrderByStartedAtDesc(AppUser user);
    List<TestAttempt> findTop5ByUserOrderByStartedAtAsc(AppUser user);
    Optional<TestAttempt> findTopByUserOrderByStartedAtDesc(AppUser user);
}
