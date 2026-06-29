import { Link } from 'react-router-dom';
import '../App.scss';

function ButtonNav({ ruta, texto, onClick }) {
  if (onClick) {
    return (
      <button type="button" className="Navbutton" onClick={onClick}>
        {texto}
      </button>
    );
  }
  return (
    <Link to={ruta} className="Navbutton">
      {texto}
    </Link>
  );
}

export default ButtonNav;
