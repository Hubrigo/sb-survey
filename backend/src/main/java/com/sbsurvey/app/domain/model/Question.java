package com.sbsurvey.app.domain.model;

import com.sbsurvey.app.domain.enums.QuestionType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id")
    private Survey survey;

    @Column(nullable = false, length = 300)
    private String prompt;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType type = QuestionType.SINGLE_CHOICE;

    @Column(name = "is_required", nullable = false)
    private boolean required = true;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options = new ArrayList<>();

    public void addOption(QuestionOption option) {
        option.setQuestion(this);
        options.add(option);
    }

    public void removeOption(QuestionOption option) {
        option.setQuestion(null);
        options.remove(option);
    }
}
