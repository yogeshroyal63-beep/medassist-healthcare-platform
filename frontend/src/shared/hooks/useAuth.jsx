import React, { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  });

  const login = ({ user: userData, accessToken, refreshToken }) => {
    setUser(userData);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    api.post("/auth/logout").catch(() => null);
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};