import React from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOATING_MENU_ITEMS } from '../constants/menu';

/**
 * 플로팅 액션 버튼 컴포넌트
 * @param {boolean} isMenuOpen - 메뉴 오픈 상태
 * @param {function} setIsMenuOpen - 메뉴 상태 변경 함수
 */
const FloatingActionButton = ({ isMenuOpen, setIsMenuOpen }) => {
  // 배경 클릭시 메뉴 닫기 핸들러
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains('backdrop')) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* 메뉴 활성화시 표시되는 반투명 배경 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="backdrop fixed inset-0 bg-black/50 z-10"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      {/* 플로팅 버튼 컨테이너 */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-20">
        {/* 메뉴 아이템 리스트 */}
        <AnimatePresence>
          {isMenuOpen && (
            <div className="space-y-3">
              {FLOATING_MENU_ITEMS.map((menuItem, index) => (
                <motion.a
                  key={menuItem.label}
                  href={menuItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                  title={menuItem.description}
                >
                  <menuItem.icon size={menuItem.iconSize} />
                  <span>{menuItem.label}</span>
                </motion.a>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* 메인 토글 버튼 */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {isMenuOpen ? <X size={24} /> : <Plus size={24} />}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingActionButton;