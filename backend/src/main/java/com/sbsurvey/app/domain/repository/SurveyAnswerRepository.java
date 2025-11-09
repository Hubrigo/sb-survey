package com.sbsurvey.app.domain.repository;

import com.sbsurvey.app.domain.model.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
    List<SurveyAnswer> findByQuestionId(Long questionId);
    long countByQuestionId(Long questionId);
}
