import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'; 
import Home from './pages/home'; 
import About from './pages/About'; 
import Services from './pages/services'; 
import Education from './pages/education';
import Projects from './pages/Projects'; 
import Contact from './pages/contact';

function App() { 
  return ( 
    <BrowserRouter> 
    <Link to="/">Home</Link> 
    <Link to="/about">About</Link> 
    <Link to="/services">Services</Link> 
    <Link to="/education">Education</Link> 
    <Link to="/projects">Projects</Link>
    <Link to="/contact">Contact</Link> 
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/services" element={<Services />} /> 
        <Route path="/education" element={<Education />} /> 
        <Route path="/projects" element={<Projects />} /> 
        <Route path="/contact" element={<Contact />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App; 
