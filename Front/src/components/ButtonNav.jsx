import { Link } from 'react-router-dom';
import '../App.scss'; 

function ButtonNav({ ruta, texto }) {
  return (
    <Link to={ruta} className="Navbutton">
      {texto}
    </Link>
  );
}

export default ButtonNav;