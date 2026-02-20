import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // { name, email }
  const [role,    setRole]    = useState(null);   // "user" | "admin"
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session from localStorage on every app load
  useEffect(() => {
    const t = localStorage.getItem('transferx_token');
    const r = localStorage.getItem('transferx_role');
    const u = localStorage.getItem('transferx_user');
    if (t && r) {
      setToken(t);
      setRole(r);
      setUser(u ? JSON.parse(u) : null);
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, roleValue, userObj) => {
    localStorage.setItem('transferx_token', tokenValue);
    localStorage.setItem('transferx_role',  roleValue);
    localStorage.setItem('transferx_user',  JSON.stringify(userObj));
    setToken(tokenValue);
    setRole(roleValue);
    setUser(userObj);
  };

  const logout = () => {
    ['transferx_token','transferx_role','transferx_user'].forEach(k =>
      localStorage.removeItem(k));
    setToken(null); setRole(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, role, token, loading, login, logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
