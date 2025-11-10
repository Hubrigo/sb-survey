package com.sbsurvey.app.web.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Data
public class CreateSurveyResponseRequest {

    @NotNull
    private Long surveyId;

    @NotBlank
    private String respondentId;

    @Valid
    private List<CreateSurveyAnswerRequest> answers = new ArrayList<>();
}
