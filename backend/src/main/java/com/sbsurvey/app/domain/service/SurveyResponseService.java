package com.sbsurvey.app.domain.service;

import com.sbsurvey.app.domain.model.Question;
import com.sbsurvey.app.domain.model.QuestionOption;
import com.sbsurvey.app.domain.model.Survey;
import com.sbsurvey.app.domain.model.SurveyAnswer;
import com.sbsurvey.app.domain.model.SurveyResponse;
import com.sbsurvey.app.domain.repository.QuestionOptionRepository;
import com.sbsurvey.app.domain.repository.QuestionRepository;
import com.sbsurvey.app.domain.repository.SurveyRepository;
import com.sbsurvey.app.domain.repository.SurveyResponseRepository;
import com.sbsurvey.app.web.dto.CreateSurveyAnswerRequest;
import com.sbsurvey.app.web.dto.CreateSurveyResponseRequest;
import com.sbsurvey.app.web.dto.SurveyResponseDto;
import com.sbsurvey.app.web.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SurveyResponseService {

    private final SurveyRepository surveyRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository optionRepository;
    private final SurveyResponseRepository responseRepository;
    private final SurveyMapper surveyMapper;

    public SurveyResponseDto submitResponse(CreateSurveyResponseRequest request) {
        Survey survey = surveyRepository.findById(request.getSurveyId())
                .orElseThrow(() -> new EntityNotFoundException("Survey not found"));

        SurveyResponse response = new SurveyResponse();
        response.setSurvey(survey);
        response.setRespondentId(request.getRespondentId());

        if (request.getAnswers() != null) {
            for (CreateSurveyAnswerRequest answerRequest : request.getAnswers()) {
                Question question = questionRepository.findById(answerRequest.getQuestionId())
                        .orElseThrow(() -> new EntityNotFoundException("Question not found"));

                SurveyAnswer answer = new SurveyAnswer();
                answer.setQuestion(question);
                if (answerRequest.getOptionId() != null) {
                    QuestionOption option = optionRepository.findById(answerRequest.getOptionId())
                            .orElseThrow(() -> new EntityNotFoundException("Option not found"));
                    answer.setOption(option);
                }
                answer.setValue(answerRequest.getValue());
                response.addAnswer(answer);
            }
        }

        SurveyResponse saved = responseRepository.save(response);
        return surveyMapper.toResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<SurveyResponseDto> findBySurvey(Long surveyId) {
        return surveyMapper.toResponseDtos(responseRepository.findBySurveyId(surveyId));
    }
}
