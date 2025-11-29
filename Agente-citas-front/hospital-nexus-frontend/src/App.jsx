import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HospitalInfo from './components/HospitalInfo';
import Chat from './components/Chat';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        {showLogin && !isLoggedIn ? (
          <Login 
            onLogin={handleLogin} 
            onClose={() => setShowLogin(false)}
          />
        ) : (
          <>
            <HospitalInfo />
            <Chat isLoggedIn={isLoggedIn} user={user} />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;