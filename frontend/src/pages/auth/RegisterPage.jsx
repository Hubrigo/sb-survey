import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAdmin } from '../../api/auth.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    registerAdmin(form)
      .then(() => {
        setSuccess(true);
        setError(null);
        setTimeout(() => navigate('/login'), 1500);
      })
      .catch(() => setError('No se pudo registrar la cuenta. Verifica los datos.'));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient">
      <div className="card shadow-lg" style={{ maxWidth: 480, width: '100%' }}>
        <div className="card-body p-4">
          <h1 className="h4 text-center text-primary mb-3">Crear cuenta</h1>
          <p className="text-muted text-center mb-4">Configura el acceso administrativo a la plataforma.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Cuenta creada correctamente. Redirigiendo...</div>}
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
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
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
              Registrarme
            </button>
          </form>
          <p className="mt-3 text-center text-muted">
            ¿Ya tienes cuenta?{' '}
            <button className="btn btn-link p-0" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
