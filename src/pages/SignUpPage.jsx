import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import Button from "../ui/Button";
import { showToast } from "../ui/Toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await userApi.signup(name, email);
      showToast("회원가입이 완료되었습니다. 로그인해주세요.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      showToast("회원가입에 실패했습니다.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
          우리 FISA
        </h1>
        <h2 className="mt-2 text-center text-xl font-medium text-blue-600">
          스터디룸 예약 서비스
        </h2>
        <div className="mt-4 text-center text-lg font-semibold text-gray-600">
          회원 가입
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                이름
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" variant="primary" fullWidth>
                회원가입
              </Button>
            </div>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 py-1 bg-white text-gray-500 text-base">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => navigate("/login")}
                variant="secondary"
                fullWidth
              >
                로그인하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
