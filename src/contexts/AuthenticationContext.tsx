import React, { createContext, ReactNode, useState } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  finishLoading: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  finishLoading: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  const finishLoading = () => setIsLoading(false);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, login, logout, finishLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
