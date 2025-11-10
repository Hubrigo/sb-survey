import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPublishedSurvey, submitResponse } from '../../api/surveys.js';

const defaultAnswerFor = (question) => {
  if (question.type === 'MULTIPLE_CHOICE') {
    return [];
  }
  return '';
};

const PublicSurveyDetailPage = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPublishedSurvey(surveyId)
      .then((response) => {
        setSurvey(response.data);
        const initialAnswers = response.data.questions?.reduce((acc, question) => {
          acc[question.id] = defaultAnswerFor(question);
          return acc;
        }, {});
        setAnswers(initialAnswers || {});
      })
      .catch(() => setError('No se pudo cargar la encuesta solicitada'))
      .finally(() => setLoading(false));
  }, [surveyId]);

  const handleChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!survey) return;
    const payload = {
      surveyId: survey.id,
      respondentId: `anon-${Date.now()}`,
      answers: survey.questions.map((question) => {
        const answerValue = answers[question.id];
        return {
          questionId: question.id,
          optionId: typeof answerValue === 'number' ? answerValue : undefined,
          value: Array.isArray(answerValue) ? answerValue.join(',') : answerValue,
        };
      }),
    };

    submitResponse(payload)
      .then(() => setSubmitted(true))
      .catch(() => setError('No fue posible enviar las respuestas. Intenta más tarde.'));
  };

  const canSubmit = useMemo(() => {
    if (!survey || !survey.questions) return false;
    return survey.questions.every((question) => {
      const value = answers[question.id];
      if (!question.required) return true;
      if (question.type === 'MULTIPLE_CHOICE') {
        return Array.isArray(value) && value.length > 0;
      }
      return Boolean(value);
    });
  }, [survey, answers]);

  if (loading) {
    return <div className="text-center py-5">Cargando encuesta...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!survey) {
    return <div className="alert alert-warning">Encuesta no disponible.</div>;
  }

  if (submitted) {
    return (
      <div className="text-center py-5">
        <h2 className="text-primary fw-bold">¡Gracias por tu participación!</h2>
        <p className="text-muted">Tus respuestas han sido registradas correctamente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <header className="mb-4 border-bottom pb-3">
        <h1 className="h3 text-primary mb-1">{survey.title}</h1>
        <p className="text-muted mb-0">{survey.description}</p>
      </header>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {survey.questions?.map((question) => (
          <div key={question.id} className="border rounded-3 p-3 bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h2 className="h5 mb-0 text-secondary">{question.prompt}</h2>
              {question.required && <span className="badge bg-danger">Obligatoria</span>}
            </div>
            {question.type === 'TEXT' && (
              <textarea
                className="form-control"
                rows="3"
                value={answers[question.id] || ''}
                onChange={(event) => handleChange(question, event.target.value)}
                required={question.required}
              />
            )}
            {question.type === 'SINGLE_CHOICE' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <div className="form-check" key={option.id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question.id}`}
                      id={`option-${option.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleChange(question, option.id)}
                      required={question.required}
                    />
                    <label className="form-check-label" htmlFor={`option-${option.id}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {question.type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-2">
                {question.options?.map((option) => {
                  const selected = answers[question.id] || [];
                  return (
                    <div className="form-check" key={option.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`option-${option.id}`}
                        value={option.id}
                        checked={selected.includes(option.id)}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          handleChange(question, isChecked ? [...selected, option.id] : selected.filter((value) => value !== option.id));
                        }}
                      />
                      <label className="form-check-label" htmlFor={`option-${option.id}`}>
                        {option.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            {question.type === 'RATING' && (
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn btn-sm ${answers[question.id] === value ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleChange(question, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary px-4" type="submit" disabled={!canSubmit}>
            Enviar respuestas
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicSurveyDetailPage;
