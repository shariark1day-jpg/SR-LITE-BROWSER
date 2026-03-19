/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Plus, 
  X, 
  Layers, 
  Monitor, 
  Smartphone,
  ExternalLink,
  MoreVertical,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Tab {
  id: string;
  url: string;
  title: string;
  isDesktop: boolean;
}

const GOOGLE_HOME = "https://www.google.com/search?igu=1";

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: GOOGLE_HOME, title: 'Google', isDesktop: false }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Update input value when active tab changes
  useEffect(() => {
    if (activeTab) {
      // Clean up the URL for display (remove igu=1 etc if needed)
      setInputValue(activeTab.url === GOOGLE_HOME ? '' : activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  const createNewTab = () => {
    const newId = Math.random().toString(36).substring(7);
    const newTab: Tab = {
      id: newId,
      url: GOOGLE_HOME,
      title: 'New Tab',
      isDesktop: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setShowTabSwitcher(false);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Reset the only tab instead of closing
      updateTab(id, { url: GOOGLE_HOME, title: 'Google' });
      return;
    }
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputValue.trim();
    if (!url) return;

    // If it's not a URL, search Google
    if (!url.includes('.') || url.includes(' ')) {
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}&igu=1`;
    } else {
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      // Force Google domain restriction as per requirements
      if (!url.includes('google.com')) {
        url = `https://www.google.com/search?q=${encodeURIComponent(inputValue)}&igu=1`;
      }
    }
    
    updateTab(activeTabId, { url, title: inputValue });
  };

  const toggleDesktop = () => {
    updateTab(activeTabId, { isDesktop: !activeTab.isDesktop });
  };

  const refreshTab = () => {
    const currentUrl = activeTab.url;
    updateTab(activeTabId, { url: 'about:blank' });
    setTimeout(() => {
      updateTab(activeTabId, { url: currentUrl });
    }, 50);
  };

  const goHome = () => {
    updateTab(activeTabId, { url: GOOGLE_HOME, title: 'Google' });
  };

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 z-20 shadow-sm">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => window.history.back()} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => window.history.forward()} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Forward"
          >
            <ChevronRight size={20} />
          </button>
          <button 
            onClick={refreshTab} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>
          <button 
            onClick={goHome} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Home"
          >
            <Home size={18} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search Google..."
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
          />
        </form>

        <div className="flex items-center gap-1">
          <button 
            onClick={toggleDesktop} 
            className={`p-2 rounded-full transition-colors ${activeTab.isDesktop ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
            title={activeTab.isDesktop ? "Switch to Mobile View" : "Switch to Desktop View"}
          >
            {activeTab.isDesktop ? <Monitor size={20} /> : <Smartphone size={20} />}
          </button>
          <button 
            onClick={() => setShowTabSwitcher(true)} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 relative"
            title="Tabs"
          >
            <Layers size={20} />
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
              {tabs.length}
            </span>
          </button>
          <button 
            onClick={() => setShowInfo(true)} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Info"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area (WebView Simulation) */}
      <main className="flex-1 relative bg-slate-200 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center overflow-hidden"
          >
            <div 
              className={`browser-viewport shadow-2xl transition-all duration-500 ease-in-out ${
                activeTab.isDesktop ? 'desktop-mode-container' : 'w-full h-full'
              }`}
              style={activeTab.isDesktop ? {
                width: '1280px',
                height: '800px',
                transform: `scale(${Math.min(window.innerWidth / 1280, (window.innerHeight - 60) / 800)})`,
                transformOrigin: 'center center'
              } : {}}
            >
              <iframe
                src={activeTab.url}
                className="w-full h-full border-none bg-white"
                title={activeTab.title}
                sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Info Modal */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setShowInfo(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">SR LITE BROWSER</h3>
                  <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4 text-sm text-slate-600">
                  <section>
                    <h4 className="font-bold text-slate-800 mb-1 uppercase text-[10px] tracking-widest">About</h4>
                    <p>A lightweight, fast browser specialized for Google search. Only navigation within Google.com is permitted for maximum focus and security.</p>
                  </section>
                  
                  <section>
                    <h4 className="font-bold text-slate-800 mb-1 uppercase text-[10px] tracking-widest">Desktop Mode</h4>
                    <p>Toggle the monitor icon in the top bar to simulate a desktop view on your mobile device. This scales the viewport to 1280px width.</p>
                  </section>
                  
                  <section>
                    <h4 className="font-bold text-slate-800 mb-1 uppercase text-[10px] tracking-widest">Mobile Installation</h4>
                    <p>To install on iOS or Android:</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li><strong>iOS:</strong> Tap the Share button in Safari and select "Add to Home Screen".</li>
                      <li><strong>Android:</strong> Tap the menu (three dots) in Chrome and select "Install app" or "Add to Home screen".</li>
                    </ul>
                  </section>
                </div>
                
                <button 
                  onClick={() => setShowInfo(false)}
                  className="w-full mt-8 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Got it
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Switcher Overlay */}
        <AnimatePresence>
          {showTabSwitcher && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm p-6 overflow-y-auto no-scrollbar"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white text-2xl font-bold">Tabs</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={createNewTab}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                    >
                      <Plus size={18} /> New Tab
                    </button>
                    <button 
                      onClick={() => setShowTabSwitcher(false)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {tabs.map((tab) => (
                    <motion.div
                      key={tab.id}
                      layoutId={tab.id}
                      onClick={() => {
                        setActiveTabId(tab.id);
                        setShowTabSwitcher(false);
                      }}
                      className={`group relative aspect-video bg-white rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${
                        activeTabId === tab.id ? 'border-blue-500 scale-105 shadow-xl shadow-blue-500/20' : 'border-transparent hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-200">
                        <span className="text-xs font-medium text-slate-600 truncate pr-4">
                          {tab.title || 'New Tab'}
                        </span>
                        <button 
                          onClick={(e) => closeTab(tab.id, e)}
                          className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="w-full h-full pt-8 flex items-center justify-center bg-slate-50">
                        <Search size={32} className="text-slate-200" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Status Bar (Optional) */}
      <footer className="bg-white border-t border-slate-100 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Secure Connection
        </div>
        <div>SR LITE BROWSER v1.0</div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .desktop-mode-container {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}} />
    </div>
  );
}
