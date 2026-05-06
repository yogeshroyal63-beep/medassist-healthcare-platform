import { createContext, useState, useCallback, useMemo } from "react";

  export const AuthContext = createContext(null);

  export function Providers({ children }) {
    const [user, setUser] = useState(() => {
      try {
        const stored = localStorage.getItem("medassist_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    });

    const [token, setToken] = useState(() =>
      localStorage.getItem("medassist_token") || null
    );

    const login = useCallback((userData, accessToken) => {
      const normalizedUser = {
        ...userData,
        role: (userData.role || "").toUpperCase(),
      };
      setUser(normalizedUser);
      setToken(accessToken);
      localStorage.setItem("medassist_user", JSON.stringify(normalizedUser));
      localStorage.setItem("medassist_token", accessToken);
    }, []);

    const logout = useCallback(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("medassist_user");
      localStorage.removeItem("medassist_token");
    }, []);

    const value = useMemo(
      () => ({ user, token, isAuthenticated: !!user, login, logout }),
      [user, token, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  