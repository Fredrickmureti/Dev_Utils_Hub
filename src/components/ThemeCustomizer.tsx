import React from 'react';
import { X, Palette, Sparkles } from 'lucide-react';

interface Props {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  setTheme: (theme: any) => void;
  rgbEffect: boolean;
  setRgbEffect: (enabled: boolean) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

const ThemeCustomizer: React.FC<Props> = ({
  theme,
  setTheme,
  rgbEffect,
  setRgbEffect,
  onClose,
  isDarkMode,
}) => {
  const presetThemes = [
    {
      name: 'Default',
      colors: {
        primary: '#4f46e5',
        secondary: '#6366f1',
        accent: '#818cf8',
        background: '#ffffff',
        text: '#1f2937',
      },
    },
    {
      name: 'Ocean',
      colors: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        background: '#f0f9ff',
        text: '#0c4a6e',
      },
    },
    {
      name: 'Forest',
      colors: {
        primary: '#059669',
        secondary: '#047857',
        accent: '#34d399',
        background: '#ecfdf5',
        text: '#064e3b',
      },
    },
    {
      name: 'Sunset',
      colors: {
        primary: '#db2777',
        secondary: '#be185d',
        accent: '#f472b6',
        background: '#fdf2f8',
        text: '#831843',
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`${
          isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        } rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative transform transition-all`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 mb-6">
          <Palette className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Theme Customizer</h2>
        </div>

        <div className="space-y-6">
          {/* RGB Effect Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>RGB Effect</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={rgbEffect}
                onChange={(e) => setRgbEffect(e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                rgbEffect ? 'bg-primary' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}></div>
            </label>
          </div>

          {/* Color Pickers */}
          {!rgbEffect && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <input
                  type="color"
                  value={theme.primary}
                  onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secondary Color</label>
                <input
                  type="color"
                  value={theme.secondary}
                  onChange={(e) => setTheme({ ...theme, secondary: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Accent Color</label>
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Preset Themes */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Preset Themes</h3>
            <div className="grid grid-cols-2 gap-2">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setTheme(preset.colors)}
                  className={`p-2 rounded-lg text-sm ${
                    isDarkMode
                      ? 'hover:bg-gray-700 border border-gray-700'
                      : 'hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <span>{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;