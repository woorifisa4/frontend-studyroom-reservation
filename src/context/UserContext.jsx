import React, { createContext, useContext, useState, useCallback } from "react";
import { userApi } from "../api/userApi";
import { showToast } from "../ui/Toast";

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (name, email) => {
    try {
      const response = await userApi.login(name, email);
      const userData = response.data;

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      showToast("로그인에 성공했습니다.", "success");
      return true;

    } catch (error) {
      showToast("로그인에 실패했습니다.", "error");
      return false;
    }
  }, []);

  const signup = useCallback(async (name, email) => {
    try {
      await userApi.signup(name, email);
      showToast("회원가입이 완료되었습니다.", "success");
      return true;
      
    } catch (error) {
      showToast("회원가입에 실패했습니다.", "error");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    showToast("로그아웃되었습니다.", "success");
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
