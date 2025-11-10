package com.sbsurvey.app.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class QuestionOptionRequest {

    private Long id;

    @NotBlank
    @Size(max = 200)
    private String label;

    private Integer displayOrder;
}
