package com.sbsurvey.app.domain.repository;

import com.sbsurvey.app.domain.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}
