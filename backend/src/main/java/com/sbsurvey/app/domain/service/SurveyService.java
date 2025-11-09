package com.sbsurvey.app.domain.service;

import com.sbsurvey.app.domain.model.Question;
import com.sbsurvey.app.domain.model.QuestionOption;
import com.sbsurvey.app.domain.model.Survey;
import com.sbsurvey.app.domain.repository.SurveyRepository;
import com.sbsurvey.app.web.dto.CreateSurveyRequest;
import com.sbsurvey.app.web.dto.QuestionOptionRequest;
import com.sbsurvey.app.web.dto.QuestionRequest;
import com.sbsurvey.app.web.dto.SurveyDto;
import com.sbsurvey.app.web.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final SurveyMapper surveyMapper;

    @Transactional(readOnly = true)
    public List<SurveyDto> findAll() {
        return surveyMapper.toSurveyDtos(surveyRepository.findAll());
    }

    @Transactional(readOnly = true)
    public SurveyDto findById(Long id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Survey not found"));
        return surveyMapper.toSurveyDto(survey);
    }

    public SurveyDto createSurvey(CreateSurveyRequest request) {
        Survey survey = new Survey();
        applyRequestToSurvey(request, survey);
        Survey saved = surveyRepository.save(survey);
        return surveyMapper.toSurveyDto(saved);
    }

    public SurveyDto updateSurvey(Long id, CreateSurveyRequest request) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Survey not found"));
        survey.getQuestions().clear();
        applyRequestToSurvey(request, survey);
        Survey saved = surveyRepository.save(survey);
        return surveyMapper.toSurveyDto(saved);
    }

    public void deleteSurvey(Long id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Survey not found"));
        surveyRepository.delete(survey);
    }

    public SurveyDto togglePublication(Long id, boolean published) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Survey not found"));
        survey.setPublished(published);
        return surveyMapper.toSurveyDto(surveyRepository.save(survey));
    }

    private void applyRequestToSurvey(CreateSurveyRequest request, Survey survey) {
        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setPublished(request.isPublished());
        if (request.getQuestions() != null) {
            for (QuestionRequest questionRequest : request.getQuestions()) {
                Question question = new Question();
                question.setPrompt(questionRequest.getPrompt());
                question.setType(questionRequest.getType());
                question.setRequired(questionRequest.isRequired());
                if (questionRequest.getOptions() != null) {
                    for (QuestionOptionRequest optionRequest : questionRequest.getOptions()) {
                        QuestionOption option = new QuestionOption();
                        option.setLabel(optionRequest.getLabel());
                        option.setDisplayOrder(optionRequest.getDisplayOrder());
                        question.addOption(option);
                    }
                }
                survey.addQuestion(question);
            }
        }
    }
}
