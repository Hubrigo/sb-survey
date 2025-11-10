package com.sbsurvey.app.domain.repository;

import com.sbsurvey.app.domain.model.Survey;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SurveyRepository extends JpaRepository<Survey, Long> {

    @EntityGraph(attributePaths = {"questions", "questions.options"})
    List<Survey> findAllByPublishedTrue();

    @EntityGraph(attributePaths = {"questions", "questions.options"})
    Optional<Survey> findByIdAndPublishedTrue(Long id);
}
