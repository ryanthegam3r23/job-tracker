import { createContext, useContext, useState } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  const register = async (email, password) => {
    const res = await axios.post(`${BASE}/api/auth/register/`, {
      email,
      password,
    });
    const access = res.data.access;
    setToken(access);
    localStorage.setItem("access", access);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${BASE}/api/auth/login/`, {
      username: email,
      password,
    });
    const access = res.data.access;
    setToken(access);
    localStorage.setItem("access", access);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("access");
    delete axios.defaults.headers.common["Authorization"];
  };

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);