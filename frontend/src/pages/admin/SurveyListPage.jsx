import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteSurvey, fetchAdminSurveys, togglePublication } from '../../api/surveys.js';
import LogoutButton from '../../components/shared/LogoutButton.jsx';

const SurveyListPage = () => {
  const [surveys, setSurveys] = useState([]);

  const loadSurveys = () => {
    fetchAdminSurveys().then((response) => setSurveys(response.data));
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleDelete = (surveyId) => {
    if (!window.confirm('¿Seguro deseas eliminar esta encuesta?')) return;
    deleteSurvey(surveyId).then(loadSurveys);
  };

  const handlePublication = (surveyId, published) => {
    togglePublication(surveyId, !published).then(loadSurveys);
  };

  return (
    <div className="space-y-4">
      <header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <h1 className="h3 text-primary mb-1">Encuestas</h1>
          <p className="text-muted mb-0">Administra tus encuestas creadas.</p>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2">
          <Link className="btn btn-primary" to="/admin/surveys/new">
            Nueva encuesta
          </Link>
          <LogoutButton className="flex-fill flex-md-grow-0" variant="outline-primary" />
        </div>
      </header>
      <div className="table-responsive bg-white rounded-4 shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey.id}>
                <td>{survey.title}</td>
                <td>
                  <span className={`badge ${survey.published ? 'bg-success' : 'bg-secondary'}`}>
                    {survey.published ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td>{survey.updatedAt ? new Date(survey.updatedAt).toLocaleString() : '-'}</td>
                <td className="text-end">
                  <div className="btn-group">
                    <Link className="btn btn-outline-primary btn-sm" to={`/admin/surveys/${survey.id}`}>
                      Editar
                    </Link>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handlePublication(survey.id, survey.published)}
                    >
                      {survey.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(survey.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {surveys.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  Aún no has creado encuestas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurveyListPage;
