package com.prepsphere.backend.service;

import com.prepsphere.backend.dto.test.*;
import com.prepsphere.backend.entity.*;
import com.prepsphere.backend.exception.ApiException;
import com.prepsphere.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final AppUserRepository userRepository;
    private final TestAttemptRepository attemptRepository;
    private final AttemptQuestionRepository attemptQuestionRepository;
    private final TestAnswerRepository testAnswerRepository;
    private final QuestionService questionService;

    @Transactional
    public StartTestResponse startTest(StartTestRequest request) {
        AppUser user = currentUser();

        List<Question> pool = questionService.findForTest(request.category(), request.difficulty());
        if (pool.size() < request.questionCount()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Not enough questions for selected category/difficulty. Available: " + pool.size());
        }

        Collections.shuffle(pool);
        List<Question> selected = pool.subList(0, request.questionCount());

        Instant startedAt = Instant.now();
        Instant expiresAt = startedAt.plusSeconds(request.durationMinutes() * 60L);

        TestAttempt attempt = TestAttempt.builder()
                .user(user)
                .category(request.category())
                .difficulty(request.difficulty())
                .questionCount(request.questionCount())
                .startedAt(startedAt)
                .expiresAt(expiresAt)
                .status(AttemptStatus.IN_PROGRESS)
                .build();

        TestAttempt savedAttempt = attemptRepository.save(attempt);

        List<AttemptQuestion> attemptQuestions = new ArrayList<>();
        List<QuestionForAttemptResponse> responseQuestions = new ArrayList<>();

        for (int i = 0; i < selected.size(); i++) {
            Question q = selected.get(i);
            attemptQuestions.add(AttemptQuestion.builder()
                    .attempt(savedAttempt)
                    .question(q)
                    .questionOrder(i + 1)
                    .build());

            responseQuestions.add(new QuestionForAttemptResponse(
                    q.getId(),
                    q.getText(),
                    q.getCategory(),
                    q.getDifficulty(),
                    q.getOptionA(),
                    q.getOptionB(),
                    q.getOptionC(),
                    q.getOptionD(),
                    i + 1
            ));
        }

        attemptQuestionRepository.saveAll(attemptQuestions);

        return new StartTestResponse(
                savedAttempt.getId(),
                request.category(),
                request.durationMinutes(),
                startedAt,
                expiresAt,
                responseQuestions
        );
    }

    @Transactional
    public SubmitTestResponse submitTest(Long attemptId, SubmitTestRequest request) {
        AppUser user = currentUser();
        TestAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Test attempt not found"));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot submit another user's attempt");
        }

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new ApiException(HttpStatus.CONFLICT, "Attempt already finalized");
        }

        if (Instant.now().isAfter(attempt.getExpiresAt())) {
            attempt.setStatus(AttemptStatus.TIME_EXCEEDED);
            attemptRepository.save(attempt);
            throw new ApiException(HttpStatus.CONFLICT, "Submission rejected. Test time exceeded");
        }

        List<AttemptQuestion> attemptQuestions = attemptQuestionRepository.findByAttemptOrderByQuestionOrderAsc(attempt);
        Set<Long> allowedQuestionIds = attemptQuestions.stream()
                .map(aq -> aq.getQuestion().getId())
                .collect(Collectors.toSet());

        Map<Long, String> submittedAnswers = request.answers().stream()
                .collect(Collectors.toMap(AnswerRequest::questionId, a -> a.selectedOption().toUpperCase(), (a, b) -> b));

        int correct = 0;
        List<TestAnswer> answersToSave = new ArrayList<>();
        List<SubmitTestReviewItem> reviewItems = new ArrayList<>();

        for (int i = 0; i < attemptQuestions.size(); i++) {
            AttemptQuestion aq = attemptQuestions.get(i);
            Question q = aq.getQuestion();
            if (!allowedQuestionIds.contains(q.getId())) {
                continue;
            }
            String selected = submittedAnswers.getOrDefault(q.getId(), "");
            boolean isCorrect = q.getCorrectOption().equalsIgnoreCase(selected);
            if (isCorrect) {
                correct++;
            }

            answersToSave.add(TestAnswer.builder()
                    .attempt(attempt)
                    .question(q)
                    .selectedOption(selected)
                    .correct(isCorrect)
                    .build());

            reviewItems.add(new SubmitTestReviewItem(
                    q.getId(),
                    i + 1,
                    q.getText(),
                    selected.isBlank() ? "Not Answered" : selected.toUpperCase(),
                    q.getCorrectOption(),
                    isCorrect
            ));
        }

        testAnswerRepository.saveAll(answersToSave);

        int total = attemptQuestions.size();
        int wrong = total - correct;
        int percentage = total == 0 ? 0 : (int) Math.round((correct * 100.0) / total);
        int score = percentage;

        attempt.setCorrectAnswers(correct);
        attempt.setWrongAnswers(wrong);
        attempt.setPercentage(percentage);
        attempt.setScore(score);
        attempt.setSubmittedAt(Instant.now());
        attempt.setStatus(AttemptStatus.SUBMITTED);

        attemptRepository.save(attempt);

        return new SubmitTestResponse(
                attempt.getId(),
                correct,
                wrong,
                score,
                percentage,
                attempt.getSubmittedAt(),
                reviewItems
        );
    }

    public List<TestHistoryItemResponse> getHistory() {
        AppUser user = currentUser();
        return attemptRepository.findByUserOrderByStartedAtDesc(user).stream()
                .map(attempt -> new TestHistoryItemResponse(
                        attempt.getId(),
                        attempt.getCategory(),
                        attempt.getQuestionCount(),
                        Optional.ofNullable(attempt.getCorrectAnswers()).orElse(0),
                        Optional.ofNullable(attempt.getWrongAnswers()).orElse(0),
                        Optional.ofNullable(attempt.getScore()).orElse(0),
                        Optional.ofNullable(attempt.getPercentage()).orElse(0),
                        attempt.getStartedAt(),
                        attempt.getSubmittedAt(),
                        attempt.getStatus().name()
                ))
                .toList();
    }

    public SubmitTestResponse getLatestResult() {
        AppUser user = currentUser();
        TestAttempt attempt = attemptRepository.findTopByUserOrderByStartedAtDesc(user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No test attempts found"));
        return buildAttemptResponse(attempt);
    }

    public BestScoreResponse getBestScore() {
        AppUser user = currentUser();
        int best = attemptRepository.findByUserOrderByStartedAtDesc(user).stream()
                .filter(a -> a.getStatus() == AttemptStatus.SUBMITTED)
                .map(a -> Optional.ofNullable(a.getPercentage()).orElse(0))
                .max(Integer::compareTo)
                .orElse(0);
        return new BestScoreResponse(best);
    }

    public AnalyticsResponse getAnalytics() {
        AppUser user = currentUser();
        List<TestAttempt> attempts = attemptRepository.findByUserOrderByStartedAtDesc(user).stream()
                .filter(a -> a.getStatus() == AttemptStatus.SUBMITTED)
                .toList();

        int totalTests = attempts.size();
        int average = attempts.isEmpty() ? 0 : (int) Math.round(
                attempts.stream().mapToInt(a -> Optional.ofNullable(a.getPercentage()).orElse(0)).average().orElse(0)
        );
        int best = attempts.stream()
                .mapToInt(a -> Optional.ofNullable(a.getPercentage()).orElse(0))
                .max()
                .orElse(0);

        Map<String, Integer> weakCategoryCount = new HashMap<>();
        for (TestAttempt attempt : attempts) {
            List<TestAnswer> answers = testAnswerRepository.findByAttempt(attempt);
            for (TestAnswer answer : answers) {
                if (!Boolean.TRUE.equals(answer.getCorrect())) {
                    weakCategoryCount.merge(answer.getQuestion().getCategory(), 1, Integer::sum);
                }
            }
        }

        String weakCategory = weakCategoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        List<TrendPointResponse> trend = attempts.stream()
                .sorted(Comparator.comparing(TestAttempt::getStartedAt))
                .skip(Math.max(0, attempts.size() - 5L))
                .map(a -> new TrendPointResponse(a.getStartedAt(), Optional.ofNullable(a.getPercentage()).orElse(0)))
                .toList();

        return new AnalyticsResponse(totalTests, average, best, weakCategory, trend);
    }

    private AppUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private SubmitTestResponse buildAttemptResponse(TestAttempt attempt) {
        List<AttemptQuestion> attemptQuestions = attemptQuestionRepository.findByAttemptOrderByQuestionOrderAsc(attempt);
        Map<Long, TestAnswer> answerByQuestion = testAnswerRepository.findByAttempt(attempt).stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a, (a, b) -> b));

        List<SubmitTestReviewItem> review = new ArrayList<>();
        for (int i = 0; i < attemptQuestions.size(); i++) {
            AttemptQuestion aq = attemptQuestions.get(i);
            TestAnswer answer = answerByQuestion.get(aq.getQuestion().getId());
            review.add(new SubmitTestReviewItem(
                    aq.getQuestion().getId(),
                    i + 1,
                    aq.getQuestion().getText(),
                    answer == null || answer.getSelectedOption().isBlank() ? "Not Answered" : answer.getSelectedOption(),
                    aq.getQuestion().getCorrectOption(),
                    answer != null && Boolean.TRUE.equals(answer.getCorrect())
            ));
        }

        return new SubmitTestResponse(
                attempt.getId(),
                Optional.ofNullable(attempt.getCorrectAnswers()).orElse(0),
                Optional.ofNullable(attempt.getWrongAnswers()).orElse(0),
                Optional.ofNullable(attempt.getScore()).orElse(0),
                Optional.ofNullable(attempt.getPercentage()).orElse(0),
                attempt.getSubmittedAt(),
                review
        );
    }
}
