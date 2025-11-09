package com.sbsurvey.app.web.controller;

import com.sbsurvey.app.domain.service.SurveyService;
import com.sbsurvey.app.web.dto.CreateSurveyRequest;
import com.sbsurvey.app.web.dto.SurveyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class SurveyController {

    private final SurveyService surveyService;

    @GetMapping
    public ResponseEntity<List<SurveyDto>> listSurveys() {
        return ResponseEntity.ok(surveyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SurveyDto> getSurvey(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SurveyDto> createSurvey(@Valid @RequestBody CreateSurveyRequest request) {
        return ResponseEntity.ok(surveyService.createSurvey(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SurveyDto> updateSurvey(@PathVariable Long id, @Valid @RequestBody CreateSurveyRequest request) {
        return ResponseEntity.ok(surveyService.updateSurvey(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        surveyService.deleteSurvey(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/publication")
    public ResponseEntity<SurveyDto> togglePublication(@PathVariable Long id, @RequestParam boolean published) {
        return ResponseEntity.ok(surveyService.togglePublication(id, published));
    }
}
