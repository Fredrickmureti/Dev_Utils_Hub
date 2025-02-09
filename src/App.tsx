import React, { useState, useEffect } from 'react';
import { Code2, Link, FileJson, Binary, Hash, Terminal, Github, Palette, Settings } from 'lucide-react';
import CodeFormatter from './components/CodeFormatter';
import JsonTools from './components/JsonTools';
import EncoderDecoder from './components/EncoderDecoder';
import HashGenerator from './components/HashGenerator';
import CliGenerator from './components/CliGenerator';
import ThemeCustomizer from './components/ThemeCustomizer';

// Define available tools type
type Tool = 'code' | 'json' | 'encoder' | 'hash' | 'cli';

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('code');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [theme, setTheme] = useState({
    primary: '#4f46e5',
    secondary: '#6366f1',
    accent: '#818cf8',
    background: '#ffffff',
    text: '#1f2937',
  });
  const [rgbEffect, setRgbEffect] = useState(false);

  // Define available tools with their metadata
  const tools = [
    { id: 'code' as Tool, name: 'Code Formatter', icon: Code2 },
    { id: 'json' as Tool, name: 'JSON Tools', icon: FileJson },
    { id: 'encoder' as Tool, name: 'Encoder/Decoder', icon: Binary },
    { id: 'hash' as Tool, name: 'Hash Generator', icon: Hash },
    { id: 'cli' as Tool, name: 'CLI Generator', icon: Terminal },
  ];

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', String(!isDarkMode));
  };

  // RGB effect animation
  useEffect(() => {
    if (rgbEffect) {
      const interval = setInterval(() => {
        const hue = (Date.now() / 20) % 360;
        document.documentElement.style.setProperty('--rgb-effect', `hsl(${hue}, 70%, 60%)`);
      }, 50);
      return () => clearInterval(interval);
    } else {
      document.documentElement.style.setProperty('--rgb-effect', theme.primary);
    }
  }, [rgbEffect, theme.primary]);

  // Load preferences on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedTheme = localStorage.getItem('theme');
    const savedRgbEffect = localStorage.getItem('rgbEffect') === 'true';
    
    setIsDarkMode(savedDarkMode);
    if (savedTheme) setTheme(JSON.parse(savedTheme));
    setRgbEffect(savedRgbEffect);
  }, []);

  // Save theme preferences
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
    localStorage.setItem('rgbEffect', String(rgbEffect));
    
    // Apply theme variables
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme, rgbEffect]);

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}
      style={{
        '--primary': theme.primary,
        '--secondary': theme.secondary,
        '--accent': theme.accent,
      } as React.CSSProperties}
    >
      {/* Navigation Bar */}
      <nav 
        className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-primary to-secondary'
        } text-white p-4 sticky top-0 z-50 transition-all duration-300`}
        style={{
          boxShadow: rgbEffect ? '0 2px 10px var(--rgb-effect)' : undefined,
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link className="h-6 w-6" />
            <h1 className="text-xl font-bold">Dev Utils Hub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white flex items-center space-x-2"
            >
              <Palette className="h-5 w-5" />
              <span className="hidden sm:inline">Customize</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* Theme Customizer */}
      {showThemeCustomizer && (
        <ThemeCustomizer
          theme={theme}
          setTheme={setTheme}
          rgbEffect={rgbEffect}
          setRgbEffect={setRgbEffect}
          onClose={() => setShowThemeCustomizer(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Tool Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTool === tool.id
                  ? rgbEffect
                    ? 'bg-[var(--rgb-effect)] text-white shadow-lg'
                    : 'bg-primary text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                boxShadow: activeTool === tool.id && rgbEffect 
                  ? '0 0 20px var(--rgb-effect)' 
                  : undefined
              }}
            >
              <tool.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Tool Content */}
        <div className={`${
          isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white'
        } rounded-lg shadow-lg p-4 sm:p-6 mb-8 transition-all duration-300`}
        style={{
          boxShadow: rgbEffect 
            ? '0 4px 20px var(--rgb-effect)' 
            : undefined
        }}>
          {activeTool === 'code' && <CodeFormatter isDarkMode={isDarkMode} />}
          {activeTool === 'json' && <JsonTools isDarkMode={isDarkMode} />}
          {activeTool === 'encoder' && <EncoderDecoder isDarkMode={isDarkMode} />}
          {activeTool === 'hash' && <HashGenerator isDarkMode={isDarkMode} />}
          {activeTool === 'cli' && <CliGenerator isDarkMode={isDarkMode} />}
        </div>

        {/* Footer */}
        <footer className={`${
          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
        } rounded-lg shadow-lg p-4 text-center transition-all duration-300`}
        style={{
          boxShadow: rgbEffect 
            ? '0 4px 20px var(--rgb-effect)' 
            : undefined
        }}>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://github.com/Fredrickmureti/Dev-Utils-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <span>|</span>
            <span>Made with ❤️ for developers</span> by <a className="text-yello-900" href="https://www.devfredrick.me">DevFredrick</a>
          </div>
          <div className="mt-2 text-sm">
            © {new Date().getFullYear()} Dev Utils Hub. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;