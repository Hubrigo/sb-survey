package com.sbsurvey.app.web.controller;

import com.sbsurvey.app.domain.model.Survey;
import com.sbsurvey.app.domain.repository.SurveyRepository;
import com.sbsurvey.app.web.dto.SurveyDto;
import com.sbsurvey.app.web.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/surveys")
@RequiredArgsConstructor
public class PublicSurveyController {

    private final SurveyRepository surveyRepository;
    private final SurveyMapper surveyMapper;

    @GetMapping
    public ResponseEntity<List<SurveyDto>> getPublishedSurveys() {
        return ResponseEntity.ok(surveyRepository.findAll().stream()
                .filter(Survey::isPublished)
                .map(surveyMapper::toSurveyDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyDto> getSurvey(@PathVariable Long id) {
        return surveyRepository.findById(id)
                .filter(Survey::isPublished)
                .map(surveyMapper::toSurveyDto)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Published survey not found"));
    }
}
