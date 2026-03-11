import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import axios from 'axios';

const Navbar = ({ user, setUser, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-300/50 dark:border-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              游戏资源库
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              onPress={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-all"
              aria-label={theme === 'light' ? '切换到暗夜模式' : '切换到白天模式'}
            >
              <span className="text-xl">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl px-3 py-1.5 border border-gray-300/50 dark:border-gray-700/50">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.username}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
                  onPress={handleLogout}
                >
                  登出
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  登录
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;