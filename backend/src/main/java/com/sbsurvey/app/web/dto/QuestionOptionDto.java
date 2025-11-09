package com.sbsurvey.app.web.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class QuestionOptionDto {
    Long id;
    String label;
    Integer displayOrder;
}
