package com.sbsurvey.app.web.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class SurveyDto {
    Long id;
    String title;
    String description;
    boolean published;
    Instant createdAt;
    Instant updatedAt;
    List<QuestionDto> questions;
}
