import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import LogoutButton from '../shared/LogoutButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/public">SaaS Survey</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/public">Encuestas públicas</NavLink>
              </li>
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">Panel</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/surveys">Mis encuestas</NavLink>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex gap-2">
              {!isAuthenticated ? (
                <>
                  <button className="btn btn-outline-light" onClick={() => navigate('/login')}>Iniciar sesión</button>
                  <button className="btn btn-light" onClick={() => navigate('/register')}>Registrarse</button>
                </>
              ) : (
                <LogoutButton variant="outline-light" />
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 container py-4">
        <Outlet />
      </main>
      <footer className="bg-dark text-white text-center py-3">
        <small>© {new Date().getFullYear()} SaaS Survey Platform</small>
      </footer>
    </div>
  );
};

export default MainLayout;
