import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Details from './pages/Details'
import Contact from './pages/Contact'
import Checklist from './pages/Checklist'

function App() {

  return (
    
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/details' element={<Details />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/checklist' element={<Checklist />}/>
      </Routes>
     </BrowserRouter>
     
  )
}

export default App
