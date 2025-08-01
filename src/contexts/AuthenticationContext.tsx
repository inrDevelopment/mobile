import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  finishLoading: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: true,
  token: null,
  login: () => {},
  logout: () => {},
  finishLoading: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userToken: string) => {
    setToken(userToken);
  };

  const logout = () => {
    setToken(null);
  };

  const finishLoading = () => {
    setIsLoading(false);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, token, login, logout, finishLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
