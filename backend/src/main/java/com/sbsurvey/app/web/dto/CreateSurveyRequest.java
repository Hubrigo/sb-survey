package com.sbsurvey.app.web.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Data
public class CreateSurveyRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @Size(max = 500)
    private String description;

    private boolean published;

    @Valid
    private List<QuestionRequest> questions = new ArrayList<>();
}
