package com.sbsurvey.app.web.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SurveyAnswerDto {
    Long id;
    Long questionId;
    Long optionId;
    String value;
}
