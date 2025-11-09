package com.sbsurvey.app.web.dto;

import com.sbsurvey.app.domain.enums.QuestionType;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Data
public class QuestionRequest {

    private Long id;

    @NotBlank
    @Size(max = 300)
    private String prompt;

    @NotNull
    private QuestionType type;

    private boolean required = true;

    @Valid
    private List<QuestionOptionRequest> options = new ArrayList<>();
}
