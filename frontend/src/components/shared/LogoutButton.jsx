import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const LogoutButton = ({ variant = 'outline-light', className = '' }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`.trim()}
      onClick={handleClick}
    >
      Cerrar sesión
    </button>
  );
};

LogoutButton.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
};

export default LogoutButton;
