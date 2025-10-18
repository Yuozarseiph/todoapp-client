import { motion } from 'framer-motion';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import icon from "../../public/icon.svg";
function Header({ user, onLogout, darkMode, setDarkMode }) {
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`shadow-md ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center">
            <img src={icon} alt="T" />
          </div>
          <h1 className="text-2xl font-bold">Todo App</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>

          {user && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <User size={20} className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className="font-medium hidden sm:inline">{user.username}</span>
            </div>
          )}

          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
