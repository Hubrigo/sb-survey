package com.sbsurvey.app.web.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class SurveyResponseDto {
    Long id;
    Long surveyId;
    String respondentId;
    Instant submittedAt;
    List<SurveyAnswerDto> answers;
}
