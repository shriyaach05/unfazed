import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [therapist, setTherapist] = useState(() =>
    JSON.parse(localStorage.getItem('therapist') || 'null')
  );

  function saveLogin(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('therapist', JSON.stringify(data.therapist));
    setTherapist(data.therapist);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('therapist');
    setTherapist(null);
  }

  return (
    <AuthContext.Provider value={{ therapist, saveLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}