import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";
import { CheckCircle, AlertCircle } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className={`fixed z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
        ${
          type === "success"
            ? "bg-green-50 border border-green-100"
            : "bg-red-50 border border-red-100"
        }`}
      style={{
        left: "50%",
        top: "20px",
        transform: "translateX(-50%)",
        width: "fit-content", // 텍스트 크기에 맞게 자동 조절
        maxWidth: "90vw", // 화면 너비의 90%를 넘지 않도록
        minWidth: "auto", // 최소 너비 제거
      }}
    >
      {icons[type]}
      <span
        className={`text-sm font-medium whitespace-normal break-words ${
          type === "success" ? "text-green-800" : "text-red-800"
        }`}
      >
        {message}
      </span>
    </motion.div>
  );
};

let currentToast = {
  message: "",
  type: "",
  timeoutId: null,
};

export const showToast = (message, type = "success") => {
  if (!toastRoot) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    toastRoot = createRoot(container);
  }

  // 이전 토스트와 동일한 메시지가 있다면 타이머를 리셋
  if (currentToast.message === message && currentToast.type === type) {
    if (currentToast.timeoutId) {
      clearTimeout(currentToast.timeoutId);
    }
    // 잠시 토스트를 제거했다가 다시 표시
    toastRoot.render(<AnimatePresence>{null}</AnimatePresence>);
    setTimeout(() => {
      renderToast(message, type);
    }, 100);
  } else {
    renderToast(message, type);
  }

  // 현재 토스트 정보 업데이트
  currentToast.message = message;
  currentToast.type = type;
};

const renderToast = (message, type) => {
  const handleClose = () => {
    currentToast = { message: "", type: "", timeoutId: null };
    toastRoot.render(<AnimatePresence>{null}</AnimatePresence>);
  };

  currentToast.timeoutId = setTimeout(handleClose, 3000);

  toastRoot.render(
    <AnimatePresence>
      <Toast message={message} type={type} onClose={handleClose} />
    </AnimatePresence>
  );
};

let toastRoot = null;
