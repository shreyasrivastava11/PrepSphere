package com.prepsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attempt_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private TestAttempt attempt;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Question question;

    @Column(nullable = false)
    private Integer questionOrder;
}
