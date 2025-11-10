package com.sbsurvey.app.domain.repository;

import com.sbsurvey.app.domain.model.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    List<SurveyResponse> findBySurveyId(Long surveyId);
    long countBySurveyId(Long surveyId);
}
