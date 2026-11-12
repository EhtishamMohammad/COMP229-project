import { Navigate, Outlet } from 'react-router-dom'; // Importing necessary components from react-router-dom for navigation and rendering nested routes
import { useAuth } from '../context/AuthContext.jsx'; // Importing the useAuth hook from the AuthContext to access authentication state and user information

function ProtectedRoute({ adminOnly = false }) { // Defining the ProtectedRoute component that takes an optional adminOnly prop to restrict access to admin users only
    const { isAuthenticated, user } = useAuth(); // Using the useAuth hook to get the isAuthenticated state and user information from the AuthContext

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />; // If the user is not authenticated, redirect them to the sign-in page using the Navigate component
    }

    if (adminOnly && user.role !== 'admin') { // If the adminOnly prop is true and the user's role is not 'admin', redirect them to the home page
        return <Navigate to="/" replace />; // If the adminOnly prop is true and the user's role is not 'admin', redirect them to the home page
    }

    return <Outlet />; // If the user is authenticated and has the required role (if adminOnly is true), render the nested routes using the Outlet component
}

export default ProtectedRoute; // Exporting the ProtectedRoute component to be used in other parts of the application