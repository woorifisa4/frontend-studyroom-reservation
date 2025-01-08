import React, { useState } from 'react';
import ReservationPage from './pages/ReservationPage';
import AuthPage from './pages/AuthPage';

const App = () => {
  const [user, setUser] = useState({ id: 1, name: '남승현', email: 'namsh1125@naver.com' })

  return (
    <div>
      <AuthPage setUser={setUser} />
    </div>
  );
};

export default App;