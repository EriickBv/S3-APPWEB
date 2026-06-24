import '../App.css'
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Peru from '../assets/Peru.jpg'
import { useNavigate } from 'react-router-dom'

function Home(){

    useEffect(() => {
        document.title = "s2 | Inicio";
    }, []);

    return(
        <div className='hero'>
        <Header ruta={"/login"} texto={"login"} />
        </div>

    )
}

export default Home
