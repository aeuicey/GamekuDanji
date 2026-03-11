import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Input, Chip } from '@heroui/react';

const Home = () => {
  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [randomGames, setRandomGames] = useState([]);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [searchType, setSearchType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showRandomGames, setShowRandomGames] = useState(() => {
    const saved = localStorage.getItem('showRandomGames');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showTags, setShowTags] = useState(() => {
    const saved = localStorage.getItem('showTags');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => { localStorage.setItem('showRandomGames', JSON.stringify(showRandomGames)); }, [showRandomGames]);
  useEffect(() => { localStorage.setItem('showTags', JSON.stringify(showTags)); }, [showTags]);
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const fetchGamesAndTags = async () => {
      try {
        setLoading(true);
        const [gamesResponse, tagsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/games'),
          axios.get('http://localhost:5000/api/games/tags/all')
        ]);
        const gamesData = Array.isArray(gamesResponse.data) ? gamesResponse.data : [];
        const tagsData = Array.isArray(tagsResponse.data) ? tagsResponse.data : [];
        setGames(gamesData);
        setTags(tagsData);
        setSearchResultCount(gamesData.length);
        const shuffled = [...gamesData].sort(() => 0.5 - Math.random());
        setRandomGames(shuffled.slice(0, 8));
      } catch (error) {
        console.error('Error fetching games and tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGamesAndTags();
  }, []);

  const saveSearchHistory = (keyword) => {
    const newHistory = [keyword, ...searchHistory.filter(item => item !== keyword)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = async () => {
    if (!searchKeyword && !selectedTag) return;
    try {
      setLoading(true);
      setCurrentPage(1);
      setShowHistory(false);
      if (searchKeyword) saveSearchHistory(searchKeyword);
      let response;
      if (selectedTag) {
        response = await axios.get(`http://localhost:5000/api/games/search/bytag?tag=${selectedTag}`);
        setSearchType('tag');
        setSearchTerm(selectedTag);
      } else if (searchKeyword) {
        response = await axios.get(`http://localhost:5000/api/games/search?keyword=${searchKeyword}`);
        setSearchType('keyword');
        setSearchTerm(searchKeyword);
      } else {
        response = await axios.get('http://localhost:5000/api/games');
        setSearchType('');
        setSearchTerm('');
      }
      setGames(response.data);
      setSearchResultCount(response.data.length);
    } catch (error) {
      console.error('Error searching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (keyword) => { setSearchKeyword(keyword); setShowHistory(false); };
  const clearHistory = () => { setSearchHistory([]); localStorage.removeItem('searchHistory'); };

  const clearSearch = async () => {
    setSelectedTag(''); setSearchKeyword(''); setSearchType(''); setSearchTerm(''); setCurrentPage(1);
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/games');
      setGames(response.data);
      setSearchResultCount(response.data.length);
    } catch (error) {
      console.error('Error clearing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = games.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(games.length / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      if (endPage - startPage < maxPagesToShow - 1) startPage = Math.max(1, endPage - maxPagesToShow + 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300" role="main">
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-200/50 to-transparent dark:from-gray-800/50 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">游戏资源库</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">探索无限游戏世界</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-300/50 dark:border-gray-700/50 overflow-hidden shadow-2xl">
                <div className="flex items-center p-4 sm:p-6">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <Input
                      placeholder="搜索游戏..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onFocus={() => setShowHistory(true)}
                      onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pl-14 sm:pl-16 pr-4 py-3 text-lg"
                      classNames={{ input: "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg leading-relaxed", inputWrapper: "bg-transparent border-none shadow-none before:hidden after:hidden" }}
                      aria-label="搜索游戏"
                    />
                    {showHistory && searchHistory.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300/50 dark:border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-300/50 dark:border-gray-700/50">
                          <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">搜索历史</span>
                          <button onClick={clearHistory} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">清除</button>
                        </div>
                        {searchHistory.map((item, index) => (
                          <button key={index} onClick={() => handleHistoryClick(item)} className="w-full text-left px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-base text-gray-700 dark:text-gray-300 flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="leading-relaxed">{item}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-6 sm:px-10 py-3 rounded-xl hover:opacity-90 transition-opacity text-base sm:text-lg" onPress={handleSearch} aria-label="搜索">搜索</Button>
                    {(selectedTag || searchKeyword) && (
                      <Button className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-base sm:text-lg" onPress={clearSearch} aria-label="清除搜索">清除</Button>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-300/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">热门:</span>
                    {tags.slice(0, 8).map(tag => (
                      <button key={tag} onClick={() => { setSelectedTag(tag); setSearchKeyword(''); handleSearch(); }} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedTag === tag ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>{tag}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">随机推荐</h2>
          </div>
          <Button variant="light" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-base font-medium" onPress={() => setShowRandomGames(!showRandomGames)} aria-label={showRandomGames ? "隐藏随机推荐" : "显示随机推荐"}>{showRandomGames ? '隐藏' : '显示'}</Button>
        </div>
        {showRandomGames && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {randomGames.map((game, index) => (
              <Link to={`/game/${game.Id}`} key={game.GameCode}>
                <Card className="group relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardBody className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={game.CoverImageUrl} alt={game.ChineseName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 mb-2 leading-relaxed">{game.ChineseName}</h3>
                        {game.EnglishName && <p className="text-gray-300 text-xs sm:text-sm line-clamp-1 leading-relaxed">{game.EnglishName}</p>}
                      </div>
                      <div className="absolute top-3 right-3"><div className="bg-pink-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold">HOT</div></div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">热门标签</h2>
          </div>
          <Button variant="light" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-base font-medium" onPress={() => setShowTags(!showTags)} aria-label={showTags ? "隐藏标签" : "显示标签"}>{showTags ? '隐藏' : '显示'}</Button>
        </div>
        {showTags && (
          <div className="flex flex-wrap gap-3">
            {tags.slice(0, 30).map((tag, index) => (
              <Chip key={tag} className={`cursor-pointer transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 py-2 ${selectedTag === tag ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none' : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50'}`} onClick={() => { setSelectedTag(tag); setSearchKeyword(''); handleSearch(); }} aria-label={`标签: ${tag}`}>{tag}</Chip>
            ))}
          </div>
        )}
      </div>

      {searchType && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-5">
            <p className="text-gray-900 dark:text-white font-medium text-base sm:text-lg leading-relaxed">
              {searchType === 'tag' ? <>检索tag 🏷️: {searchTerm}, 共检索到 {searchResultCount} 个资源</> : <>{searchTerm}, 共检索到 {searchResultCount} 个资源</>}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20" role="status" aria-live="polite" aria-busy="true">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-pink-500 rounded-full animate-pulse"></div></div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {currentGames.map((game, index) => (
              <Link to={`/game/${game.Id}`} key={game.GameCode}>
                <Card className="group relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20" style={{ animationDelay: `${index * 50}ms` }} aria-label={`游戏: ${game.ChineseName}`}>
                  <CardBody className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={game.CoverImageUrl} alt={game.ChineseName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 mb-2 leading-relaxed">{game.ChineseName}</h3>
                        {game.EnglishName && <p className="text-gray-300 text-xs sm:text-sm line-clamp-1 mb-2 leading-relaxed">{game.EnglishName}</p>}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><span>{game.Size}</span></div>
                        <div className="flex flex-wrap gap-1.5">
                          {game.Tags && game.Tags.slice(0, 2).map(tag => (<span key={tag} className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full">{tag}</span>))}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 sm:gap-3 mt-10 sm:mt-14 flex-wrap" role="navigation" aria-label="分页控制">
              <Button size="sm" className="bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50 text-sm sm:text-base px-4 py-2" isDisabled={currentPage === 1} onPress={() => setCurrentPage(1)} aria-label="首页">首页</Button>
              <Button size="sm" className="bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50 text-sm sm:text-base px-4 py-2" isDisabled={currentPage === 1} onPress={() => setCurrentPage(currentPage - 1)} aria-label="上一页">上一页</Button>
              {getPageNumbers().map(number => (
                <Button key={number} size="sm" className={`text-sm sm:text-base px-4 py-2 ${currentPage === number ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50'}`} onPress={() => setCurrentPage(number)} aria-label={`第 ${number} 页`}>{number}</Button>
              ))}
              <Button size="sm" className="bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50 text-sm sm:text-base px-4 py-2" isDisabled={currentPage === totalPages} onPress={() => setCurrentPage(currentPage + 1)} aria-label="下一页">下一页</Button>
              <Button size="sm" className="bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300/50 dark:border-gray-700/50 hover:border-pink-500/50 text-sm sm:text-base px-4 py-2" isDisabled={currentPage === totalPages} onPress={() => setCurrentPage(totalPages)} aria-label="末页">末页</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;