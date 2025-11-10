package com.sbsurvey.app.web.mapper;

import com.sbsurvey.app.domain.model.Question;
import com.sbsurvey.app.domain.model.QuestionOption;
import com.sbsurvey.app.domain.model.Survey;
import com.sbsurvey.app.domain.model.SurveyResponse;
import com.sbsurvey.app.domain.model.SurveyAnswer;
import com.sbsurvey.app.web.dto.*;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SurveyMapper {

    @Mapping(target = "questions", source = "questions")
    SurveyDto toSurveyDto(Survey survey);

    List<SurveyDto> toSurveyDtos(List<Survey> surveys);

    @Mapping(target = "options", source = "options")
    QuestionDto toQuestionDto(Question question);

    List<QuestionDto> toQuestionDtos(List<Question> questions);

    QuestionOptionDto toQuestionOptionDto(QuestionOption option);

    List<QuestionOptionDto> toQuestionOptionDtos(List<QuestionOption> options);

    SurveyResponseDto toResponseDto(SurveyResponse response);

    List<SurveyResponseDto> toResponseDtos(List<SurveyResponse> responses);

    SurveyAnswerDto toAnswerDto(SurveyAnswer answer);

    List<SurveyAnswerDto> toAnswerDtos(List<SurveyAnswer> answers);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateSurveyFromDto(SurveyDto surveyDto, @MappingTarget Survey survey);
}
