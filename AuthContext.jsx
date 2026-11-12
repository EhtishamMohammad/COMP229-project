import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;        
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    const login = (userData, accessToken) => {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    }; 

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                token, 
                isAuthenticated: Boolean(token && user),
                login, 
                logout 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}