import React, { createContext, useContext, useState, useCallback } from "react";
import { userApi } from "../api/userApi";
import { showToast } from "../ui/Toast";
import CryptoJS from "crypto-js";

const STORAGE_KEY = "woorifisa-studyroom-reservation-user-info";
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;
const IV_LENGTH = parseInt(process.env.REACT_APP_IV_LENGTH);

// 환경변수 유효성 검사
if (!ENCRYPTION_KEY || !IV_LENGTH) {
  throw new Error(
    "필수 환경변수가 설정되지 않았습니다. (.env 파일을 확인해주세요)"
  );
}

// 향상된 암호화 함수
const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // IV와 암호화된 데이터를 함께 저장
    const result = {
      iv: iv.toString(),
      content: encrypted.toString(),
      hash: CryptoJS.SHA256(jsonString).toString(),
    };
    return btoa(JSON.stringify(result));
  } catch {
    return null;
  }
};

// 향상된 복호화 함수
const decryptData = (encryptedData) => {
  try {
    const { iv, content, hash } = JSON.parse(atob(encryptedData));
    const decrypted = CryptoJS.AES.decrypt(content, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    // 데이터 무결성 검증
    if (CryptoJS.SHA256(decryptedString).toString() !== hash) {
      console.error("Data integrity check failed");
      return null;
    }

    const data = JSON.parse(decryptedString);
    if (!data.name || !data.email) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

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
    const encryptedUser = localStorage.getItem(STORAGE_KEY);
    return encryptedUser ? decryptData(encryptedUser) : null;
  });

  const login = useCallback(async (name, email) => {
    try {
      const response = await userApi.login(name, email);
      const userData = response.data;

      const encryptedData = encryptData(userData);
      if (encryptedData) {
        localStorage.setItem(STORAGE_KEY, encryptedData);
        setUser(userData);
        showToast("로그인에 성공했습니다.", "success");
        return true;
      }
      throw new Error("Data encryption failed");
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
    localStorage.removeItem(STORAGE_KEY);
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
