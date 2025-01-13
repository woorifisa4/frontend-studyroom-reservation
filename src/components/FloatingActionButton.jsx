import React from 'react';
import { Plus, X, FileText, MessageSquare, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionButton = ({ isFabActivated, setIsFabActivated }) => {
  const fabItems = [
    {
      label: 'Release note',
      icon: <FileText size={18} />,
      href: 'https://woorifisa4.notion.site/',
    },
    {
      label: '기능 건의',
      icon: <MessageSquare size={18} />,
      href: 'https://forms.gle/7zep5wTSUFpbmqR57',
    },
    {
      label: '버그 건의',
      icon: <Bug size={18} />,
      href: 'https://forms.gle/oYkteotnATxMzQNf8',
    },
  ];

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('backdrop')) {
      setIsFabActivated(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isFabActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="backdrop fixed inset-0 bg-black/50 z-10"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-20">
        <AnimatePresence>
          {isFabActivated && (
            <div className="space-y-3">
              {fabItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsFabActivated(!isFabActivated)}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isFabActivated ? <X size={24} /> : <Plus size={24} />}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingActionButton;