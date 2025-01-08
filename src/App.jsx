import React, { useState } from 'react';
import ReservationPage from './pages/ReservationPage';

const App = () => {
  const [user, setUser] = useState({ id: 1, name: '남승현', email: 'namsh1125@naver.com' })

  return (
    <div>
      <ReservationPage user={user}/>
    </div>
  );
};

export default App;