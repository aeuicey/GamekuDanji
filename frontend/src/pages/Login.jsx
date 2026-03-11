import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardBody } from '@heroui/react';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || '登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-md w-full">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-300/50 dark:border-gray-700/50 shadow-2xl">
          <CardBody className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                游戏资源库
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">登录您的账户以开始探索游戏世界</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="用户名"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  classNames={{
                    input: "text-gray-900 dark:text-white text-base sm:text-lg",
                    inputWrapper: "bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50",
                  }}
                />
                
                <Input
                  label="密码"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  classNames={{
                    input: "text-gray-900 dark:text-white text-base sm:text-lg",
                    inputWrapper: "bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50",
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-6 text-lg rounded-xl hover:opacity-90 transition-opacity"
              >
                登录
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;