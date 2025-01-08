import React from 'react';

const FloatingActionButton = ({ isFabActivated, setIsFabActivated }) => {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('backdrop')) {
      setIsFabActivated(false);
    }
  };

  return (
    <>
      {isFabActivated && (
        <div className="backdrop fixed inset-0 bg-black bg-opacity-50 z-10" onClick={handleBackdropClick}></div>
      )}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-20">
        {isFabActivated && (
          <>
            <a href="https://woorifisa4.notion.site/" target="_blank" className="px-4 py-2 bg-white text-black rounded-full shadow-lg transform transition-transform duration-300 translate-y-0 hover:bg-gray-200">
              Release note
            </a>
            <a href="https://forms.gle/7zep5wTSUFpbmqR57" target="_blank" className="px-4 py-2 bg-white text-black rounded-full shadow-lg transform transition-transform duration-300 translate-y-0 hover:bg-gray-200">
              기능 건의
            </a>
            <a href="https://forms.gle/oYkteotnATxMzQNf8" target="_blank" className="px-4 py-2 bg-white text-black rounded-full shadow-lg transform transition-transform duration-300 translate-y-0 hover:bg-gray-200">
              버그 건의
            </a>
          </>
        )}
        <button
          onClick={() => setIsFabActivated(!isFabActivated)}
          className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transform transition-transform duration-300 hover:bg-blue-600"
        >
          +
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;
