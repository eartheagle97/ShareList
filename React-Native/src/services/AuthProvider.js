import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // const [token, setToken] = useState(
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTdjZmY0MTMxMDMxYTAwNDQyZjcxYmEiLCJpYXQiOjE3MDMzMDMwNTl9.EmAyx-g5JucT58l4PS_dlK3kUcw024K6ht5r72xOOfE"
  // );
  // const [user, setUser] = useState("657cff4131031a00442f71ba");

  const login = async (newToken) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser();
  };

  const contextValue = {
    token,
    user,
    setUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
