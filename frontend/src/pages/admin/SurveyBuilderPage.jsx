import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createSurvey, fetchSurvey, updateSurvey } from '../../api/surveys.js';
import LogoutButton from '../../components/shared/LogoutButton.jsx';

const emptyQuestion = () => ({
  prompt: '',
  type: 'SINGLE_CHOICE',
  required: true,
  options: [{ label: 'Opción 1' }],
});

const SurveyBuilderPage = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const isEdit = Boolean(surveyId);

  const [form, setForm] = useState({
    title: '',
    description: '',
    published: false,
    questions: [emptyQuestion()],
  });

  useEffect(() => {
    if (!isEdit) return;
    fetchSurvey(surveyId).then((response) => {
      const survey = response.data;
      setForm({
        title: survey.title,
        description: survey.description,
        published: survey.published,
        questions: survey.questions?.map((question) => ({
          id: question.id,
          prompt: question.prompt,
          type: question.type,
          required: question.required,
          options: question.options?.map((option) => ({
            id: option.id,
            label: option.label,
            displayOrder: option.displayOrder,
          })) || [],
        })) || [emptyQuestion()],
      });
    });
  }, [isEdit, surveyId]);

  const updateQuestion = (index, next) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      questions[index] = {
        ...questions[index],
        ...next,
      };
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, emptyQuestion()],
    }));
  };

  const removeQuestion = (index) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const action = isEdit ? updateSurvey(surveyId, form) : createSurvey(form);
    action.then(() => navigate('/admin/surveys'));
  };

  return (
    <div className="space-y-4">
      <header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <h1 className="h3 text-primary mb-1">{isEdit ? 'Editar encuesta' : 'Nueva encuesta'}</h1>
          <p className="text-muted mb-0">Define las preguntas y opciones disponibles.</p>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2">
          <Link className="btn btn-outline-secondary" to="/admin/surveys">
            Volver
          </Link>
          <LogoutButton className="flex-fill flex-md-grow-0" variant="outline-primary" />
        </div>
      </header>
      <form className="bg-white rounded-4 shadow-sm p-4 space-y-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label fw-semibold">Título</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="publishedSwitch"
                checked={form.published}
                onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))}
              />
              <label className="form-check-label" htmlFor="publishedSwitch">Publicar encuesta</label>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
        </div>
        <section className="space-y-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h5 text-secondary mb-0">Preguntas</h2>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addQuestion}>
              Añadir pregunta
            </button>
          </div>
          {form.questions.map((question, index) => (
            <div key={index} className="border rounded-3 p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 text-uppercase text-muted mb-0">Pregunta {index + 1}</h3>
                {form.questions.length > 1 && (
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeQuestion(index)}>
                    Eliminar
                  </button>
                )}
              </div>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label">Texto de la pregunta</label>
                  <input
                    className="form-control"
                    value={question.prompt}
                    onChange={(event) => updateQuestion(index, { prompt: event.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-select"
                    value={question.type}
                    onChange={(event) => updateQuestion(index, { type: event.target.value })}
                  >
                    <option value="SINGLE_CHOICE">Opción única</option>
                    <option value="MULTIPLE_CHOICE">Selección múltiple</option>
                    <option value="TEXT">Respuesta abierta</option>
                    <option value="RATING">Calificación (1-5)</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`required-${index}`}
                      checked={question.required}
                      onChange={(event) => updateQuestion(index, { required: event.target.checked })}
                    />
                    <label className="form-check-label" htmlFor={`required-${index}`}>
                      Obligatoria
                    </label>
                  </div>
                </div>
              </div>
              {(question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && (
                <div className="mt-3">
                  <label className="form-label">Opciones</label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="input-group mb-2">
                      <input
                        className="form-control"
                        value={option.label}
                        onChange={(event) => {
                          const updatedOptions = question.options.map((item, idx) =>
                            idx === optionIndex ? { ...item, label: event.target.value } : item
                          );
                          updateQuestion(index, { options: updatedOptions });
                        }}
                      />
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => {
                          const updatedOptions = question.options.filter((_, idx) => idx !== optionIndex);
                          updateQuestion(index, { options: updatedOptions });
                        }}
                        disabled={question.options.length <= 1}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuestion(index, { options: [...question.options, { label: 'Nueva opción' }] })}
                  >
                    Añadir opción
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
        <div className="d-flex justify-content-end gap-2">
          <Link className="btn btn-outline-secondary" to="/admin/surveys">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyBuilderPage;
