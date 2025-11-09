import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../../api/auth.js';
import { useAuth } from '../../hooks/useAuth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    loginRequest(form)
      .then((response) => {
        login(response.data.token);
        navigate('/admin');
      })
      .catch(() => setError('Credenciales inválidas.'));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient">
      <div className="card shadow-lg" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body p-4">
          <h1 className="h4 text-center text-primary mb-3">Iniciar sesión</h1>
          <p className="text-muted text-center mb-4">Accede al panel administrativo de encuestas.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                className="form-control"
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
          <p className="mt-3 text-center text-muted">
            ¿No tienes cuenta?{' '}
            <button className="btn btn-link p-0" onClick={() => navigate('/register')}>
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
