import React, { useState } from 'react';
import { signUp } from '../api/signUp';
import { login } from '../api/login';
import logo from '../image/logo.png';

const AuthPage = ({setUser}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async () => {
    try {
      await signUp(name, email);

    } catch (error) {
      console.error('Error signing up:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(name, email);
      setUser(response.data);

    } catch (error) {
      console.error('Error logging in:', error);
      alert('로그인에 실패했습니다.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={logo} alt="Woorifisa Logo" className="mb-4 w-96 h-96" />
      <h2 className="mb-8 text-4xl font-semibold">스터디룸 예약 사이트</h2>
      <div className="w-full max-w-xs">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-3 border rounded w-full"
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-3 border rounded w-full"
        />
        <div className="flex justify-between">
          <button onClick={handleSignup} className="p-3 bg-blue-500 text-white rounded w-1/2 mr-2">회원가입</button>
          <button onClick={handleLogin} className="p-3 bg-gray-500 text-white rounded w-1/2 ml-2">로그인</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
