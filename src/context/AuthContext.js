import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      // Optionally fetch user data here
      setUser({ id: "user-id" }); // Placeholder
    } else {
      delete axios.defaults.headers.Authorization;
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      username,
      password,
    });
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const signup = async (username, password) => {
    await axios.post("http://localhost:5000/api/auth/signup", {
      username,
      password,
    });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};