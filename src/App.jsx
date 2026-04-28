/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, LayoutGrid, Clock, Trophy, ChevronLeft, Maximize2, RotateCcw, Info } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Categories extracted from data
  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)].sort();
  }, []);

  // Filtered games
  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedGame(null);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-primary selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 header-blur border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={handleBack}
          id="site-logo"
        >
          <div className="bg-brand-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-ink">
            NEXUS<span className="text-brand-primary">GAMES</span>
          </h1>
        </div>

        {!selectedGame && (
          <div className="hidden md:flex flex-1 max-w-xl mx-12">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Find a game..."
                className="w-full bg-surface-muted border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors" id="favorites-btn">
            <Trophy size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 md:px-12 py-8 max-w-7xl mx-auto w-full"
            >
              {/* Hero Section */}
              {activeCategory === 'All' && !searchQuery && (
                <section className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[25/8] game-card-shadow border border-white/5" id="hero-section">
                  <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1920" 
                    alt="Nexus Games Banner"
                    className="w-full h-full object-cover brightness-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-block px-3 py-1 bg-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase rounded-full border border-brand-primary/30 mb-4">
                        Featured Now
                      </span>
                      <h2 className="text-4xl md:text-6xl font-black mb-4 leading-none text-ink">
                        THE NEXT GEN OF<br />UNBLOCKED PLAY
                      </h2>
                      <p className="text-white/60 max-w-lg text-lg mb-8">
                        Experience lightning fast web games with zero restrictions. 
                        No downloads, no blocks, just pure performance.
                      </p>
                    </motion.div>
                  </div>
                </section>
              )}

              {/* Mobile Search */}
              <div className="md:hidden mt-4 mb-8">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    placeholder="Find a game..."
                    className="w-full bg-surface-muted border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtering */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar" id="category-filter">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeCategory === cat 
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                        : 'bg-surface-muted text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="games-grid">
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => handleGameSelect(game)}
                      className="group cursor-pointer bg-surface-muted rounded-2xl overflow-hidden border border-white/5 game-card-shadow flex flex-col h-full"
                      id={`game-card-${game.id}`}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-brand-primary p-4 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                            <Gamepad2 className="text-white" size={32} />
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white">
                            {game.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-brand-primary transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-sm text-white/40 line-clamp-2 mb-4 flex-1">
                          {game.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {game.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-white/20 font-mono">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-white/30">
                  <LayoutGrid size={64} strokeWidth={1} className="mb-4" />
                  <p className="text-xl font-medium tracking-tight">No games found matching your search</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="mt-4 text-brand-primary hover:underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="game-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[60] bg-surface flex flex-col ${isFullScreen ? 'p-0' : 'p-0 md:p-8'}`}
            >
              <div className={`flex flex-col w-full h-full max-w-7xl mx-auto overflow-hidden ${isFullScreen ? '' : 'rounded-none md:rounded-3xl border border-white/10 game-card-shadow'} bg-black`}>
                {/* Game Toolbar */}
                <div className="bg-surface-muted border-b border-white/5 py-3 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleBack}
                      className="p-2 -ml-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      title="Back to home"
                      id="back-btn"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h2 className="text-sm font-bold text-ink leading-tight">{selectedGame.title}</h2>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{selectedGame.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const iframe = document.getElementById('game-iframe');
                        if(iframe) iframe.src = iframe.src;
                      }}
                      className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Reload game"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button 
                      onClick={toggleFullScreen}
                      className={`p-2 rounded-lg transition-colors ${isFullScreen ? 'text-brand-primary bg-brand-primary/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                      title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                    >
                      <Maximize2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Game Container */}
                <div className="relative flex-1 group">
                  <iframe
                    id="game-iframe"
                    src={selectedGame.iframeUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title={selectedGame.title}
                  />
                  
                  {/* Subtle info overlay on hover */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                      <Clock size={14} className="text-brand-primary" />
                      <span className="text-xs text-white/60 font-medium">Playing on Nexus Cloud</span>
                    </div>
                  </div>
                </div>
                
                {/* Details under game (not in fullscreen) */}
                {!isFullScreen && (
                  <div className="bg-surface-muted/50 p-6 flex items-start gap-6 border-t border-white/5 overflow-y-auto max-h-48 md:max-h-none">
                     <div className="hidden md:block w-24 aspect-square rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={selectedGame.thumbnail} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <Info size={16} className="text-brand-primary" />
                           <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Game Info</h3>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                          {selectedGame.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedGame.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/40 border border-white/5 uppercase font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-12 px-6 border-t border-white/5 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Gamepad2 className="text-white/20" size={20} />
          <p className="text-xs font-bold tracking-[0.2em] text-white/20 uppercase">Nexus Ecosystem v1.0</p>
        </div>
        <div className="flex gap-8 text-white/30 text-[10px] uppercase font-bold tracking-widest mb-4">
          <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Discord</a>
        </div>
        <p className="text-[10px] text-white/10 text-center max-w-sm">
          Nexus Games is a community-driven unblocked gaming portal. All games are provided via iframes from their original creators.
        </p>
      </footer>
    </div>
  );
}
