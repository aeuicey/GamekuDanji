import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Chip } from '@heroui/react';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/games/${id}`);
        setGame(response.data);
      } catch (error) {
        console.error('Error fetching game detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">游戏不存在</h1>
          <p className="text-gray-400 mb-8">请返回首页重新搜索</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 text-gray-900 dark:text-white pb-12 transition-colors duration-300">
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex items-center justify-center">
        <img src={game.HeaderImageUrl} alt={game.ChineseName} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-900 via-gray-100/50 dark:via-gray-900/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 sm:-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <img src={game.CoverImageUrl} alt={game.ChineseName} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm px-4 py-2 rounded-full font-bold">热门</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">{game.ChineseName}</h1>
              {game.EnglishName && <h2 className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{game.EnglishName}</h2>}
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-300/50 dark:border-gray-700/50">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">发布日期</span>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg mt-1">{game.ReleaseDate || '未知'}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">更新日期</span>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg mt-1">{game.UpdateDate || '未知'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">文件大小</span>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg mt-1">{game.Size || '未知'}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">游戏代码</span>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg mt-1">{game.GameCode || '未知'}</p>
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">标签</h3>
                <div className="flex flex-wrap gap-3">
                  {game.Tags && game.Tags.map(tag => (
                    <Chip key={tag} className="bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-300/50 dark:border-gray-600/50 hover:border-pink-500/50 transition-colors cursor-pointer text-base px-4 py-2">{tag}</Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">下载链接</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.DownloadUrl1 && (
                  <a href={game.DownloadUrl1} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity text-lg py-6" size="lg">下载链接 1</Button>
                  </a>
                )}
                {game.DownloadUrl2 && (
                  <a href={game.DownloadUrl2} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:opacity-90 transition-opacity text-lg py-6" size="lg">下载链接 2</Button>
                  </a>
                )}
              </div>
              {!game.DownloadUrl1 && !game.DownloadUrl2 && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">暂无下载链接</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;