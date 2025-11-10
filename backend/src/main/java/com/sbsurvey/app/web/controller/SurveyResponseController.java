package com.sbsurvey.app.web.controller;

import com.sbsurvey.app.domain.service.SurveyResponseService;
import com.sbsurvey.app.web.dto.CreateSurveyResponseRequest;
import com.sbsurvey.app.web.dto.SurveyResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
@Validated
public class SurveyResponseController {

    private final SurveyResponseService responseService;

    @PostMapping
    public ResponseEntity<SurveyResponseDto> submitResponse(@Valid @RequestBody CreateSurveyResponseRequest request) {
        return ResponseEntity.ok(responseService.submitResponse(request));
    }

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<List<SurveyResponseDto>> getResponses(@PathVariable Long surveyId) {
        return ResponseEntity.ok(responseService.findBySurvey(surveyId));
    }
}
