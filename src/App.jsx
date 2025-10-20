import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import Header from './components/Header';
import { authService } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return false;
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${darkMode ? 'from-gray-900 via-gray-800 to-gray-700' : 'from-purple-100 via-pink-50 to-blue-100'}`}>
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'bg-gray-900 text-gray-100 min-h-screen' : 'bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen'}>
      <Header user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      {!user ? (
        <Auth key="auth" onLogin={handleLogin} darkMode={darkMode} />
      ) : (
        <TodoList darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;
