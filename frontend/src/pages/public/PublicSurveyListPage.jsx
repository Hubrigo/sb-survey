import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedSurveys } from '../../api/surveys.js';

const PublicSurveyListPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublishedSurveys()
      .then((response) => setSurveys(response.data))
      .catch(() => setError('No se pudieron cargar las encuestas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-5">Cargando encuestas...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <header className="text-center py-4">
        <h1 className="display-6 fw-bold text-primary">Participa en nuestras encuestas</h1>
        <p className="text-muted">Explora las encuestas disponibles y comparte tu opinión.</p>
      </header>
      <div className="row g-4">
        {surveys.map((survey) => (
          <div className="col-md-6 col-xl-4" key={survey.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{survey.title}</h5>
                <p className="card-text text-muted flex-grow-1">{survey.description || 'Sin descripción'}</p>
                <Link to={`/public/${survey.id}`} className="btn btn-outline-primary mt-3 align-self-start">
                  Responder encuesta
                </Link>
              </div>
            </div>
          </div>
        ))}
        {surveys.length === 0 && <p className="text-muted text-center">No hay encuestas disponibles actualmente.</p>}
      </div>
    </div>
  );
};

export default PublicSurveyListPage;
