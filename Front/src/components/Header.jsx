import CencosudLogo from '../assets/CencosudLogo.png'
import ButtonNav from './ButtonNav'
import '../App.css'

function Header({ruta, texto}){
    return(
    <div className='header'>
        <img src={CencosudLogo} className='logo'></img>
        <h1>Lore ipsum</h1>
        <ButtonNav texto={texto} ruta={ruta} />
        
    </div>
    )
}

export default Header