import { useEffect, useState } from 'react';
import { fetchAdminSurveys, fetchResponses } from '../../api/surveys.js';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchAdminSurveys().then((response) => {
      setSurveys(response.data);
      if (response.data.length > 0) {
        setSelectedSurvey(response.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedSurvey) return;
    fetchResponses(selectedSurvey).then((response) => setResponses(response.data));
  }, [selectedSurvey]);

  const chartData = responses.map((response) => ({
    submittedAt: new Date(response.submittedAt).toLocaleString(),
    answers: response.answers?.length || 0,
  }));

  return (
    <div className="space-y-4">
      <header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <h1 className="h3 text-primary mb-1">Panel de administración</h1>
          <p className="text-muted mb-0">Monitorea tus encuestas y respuestas en tiempo real.</p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={selectedSurvey || ''}
            onChange={(event) => setSelectedSurvey(Number(event.target.value))}
          >
            {surveys.map((survey) => (
              <option key={survey.id} value={survey.id}>
                {survey.title}
              </option>
            ))}
          </select>
        </div>
      </header>
      <section className="bg-white rounded-4 shadow-sm p-4">
        <h2 className="h5 text-secondary mb-3">Actividad reciente</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm bg-gradient position-relative overflow-hidden">
              <div className="card-body">
                <h3 className="h4 text-primary">{surveys.length}</h3>
                <p className="text-muted mb-0">Encuestas totales</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h3 className="h4 text-success">{responses.length}</h3>
                <p className="text-muted mb-0">Respuestas registradas</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4" style={{ height: 320 }}>
          {responses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="submittedAt" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="answers" stroke="#1d4ed8" fillOpacity={1} fill="url(#colorResponses)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted">Aún no hay respuestas para la encuesta seleccionada.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
