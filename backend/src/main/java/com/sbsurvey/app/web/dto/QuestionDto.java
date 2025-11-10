package com.sbsurvey.app.web.dto;

import com.sbsurvey.app.domain.enums.QuestionType;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class QuestionDto {
    Long id;
    String prompt;
    QuestionType type;
    boolean required;
    List<QuestionOptionDto> options;
}
