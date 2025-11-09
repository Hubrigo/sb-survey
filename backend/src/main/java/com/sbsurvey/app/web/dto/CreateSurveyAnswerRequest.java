package com.sbsurvey.app.web.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateSurveyAnswerRequest {

    @NotNull
    private Long questionId;

    private Long optionId;

    private String value;
}
