import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'; 
import Home from './pages/Home.jsx'; 
import About from './pages/About.jsx'; 
import Services from './pages/services.jsx'; 
import Education from './pages/Education.jsx';
import Projects from './pages/Project.jsx'; 
import Contact from './pages/Contact.jsx';
import SignUp from './pages/SignUp.jsx'; 
import SignIn from './pages/SignIn.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminContacts from './pages/AdminContacts.jsx';

function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>
            Welcome, {user.name} Your role is {user.role}!
            <button onClick={logout}>Logout</button>
        </p>
      ) : (
          <p>You are not logged in.</p>
      )}
    </div>
  );
}

function App() { 
  return ( 
    <AuthProvider>
      <BrowserRouter> 
        <Link to="/">Home</Link> 
        <Link to="/about">About</Link> 
        <Link to="/services">Services</Link> 
        <Link to="/education">Education</Link> 
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link> 
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>
        <AuthStatus /> 
          <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/about" element={<About />} /> 
            <Route path="/services" element={<Services />} /> 
            <Route path="/education" element={<Education />} /> 
            <Route path="/projects" element={<Projects />} /> 
            <Route path="/contact" element={<Contact />} /> 
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/contacts" element={<AdminContacts />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App; 
