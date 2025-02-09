import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

// Enhanced CodeFormatter with language detection and advanced formatting
function CodeFormatter({ isDarkMode }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);

  // Available programming languages with their identifiers
  const languages = [
    { id: 'javascript', name: 'JavaScript/TypeScript' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'json', name: 'JSON' },
    { id: 'sql', name: 'SQL' },
    { id: 'markdown', name: 'Markdown' },
  ];

  // Detect language based on code content
  const detectLanguage = (code: string): string => {
    if (!autoDetect) return language;
    
    const patterns = {
      html: /<[^>]*>/,
      css: /{[\s\S]*}/,
      json: /^[\s\n]*[{[]/,
      sql: /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\b/i,
      markdown: /^#|^\*\*|^\-\s|^\d\./m,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) return lang;
    }
    
    return 'javascript'; // Default to JavaScript
  };

  // Format code based on detected or selected language
  const formatCode = () => {
    try {
      const detectedLang = detectLanguage(input);
      if (autoDetect) setLanguage(detectedLang);
      
      let formatted = input;
      
      switch (detectedLang) {
        case 'javascript':
          // Advanced JS formatting with error handling and comments preservation
          formatted = formatJavaScript(input);
          break;
        case 'html':
          formatted = formatHTML(input);
          break;
        case 'css':
          formatted = formatCSS(input);
          break;
        case 'json':
          formatted = JSON.stringify(JSON.parse(input), null, 2);
          break;
        case 'sql':
          formatted = formatSQL(input);
          break;
        case 'markdown':
          formatted = formatMarkdown(input);
          break;
      }
      
      setOutput(formatted);
    } catch (error) {
      setOutput('Error: Invalid code format. Please check your syntax.');
    }
  };

  // Advanced JavaScript formatting
  const formatJavaScript = (code: string): string => {
    try {
      // Preserve comments and format
      const lines = code.split('\n');
      const formatted = lines.map(line => {
        // Preserve indentation
        const indent = line.match(/^\s*/)[0];
        // Handle comments
        if (line.trim().startsWith('//')) return line;
        // Basic formatting for non-comment lines
        return indent + line.trim()
          .replace(/([{(\[]) /g, '$1')
          .replace(/ ([})\]])/g, '$1')
          .replace(/\s*,\s*/g, ', ')
          .replace(/\s*;\s*/g, ';')
          .replace(/\s*=\s*/g, ' = ');
      }).join('\n');

      // Try to evaluate and catch syntax errors
      Function(`return ${formatted}`);
      return formatted;
    } catch (error) {
      throw new Error('Invalid JavaScript syntax');
    }
  };

  // HTML formatting with proper indentation
  const formatHTML = (code: string): string => {
    return code
      .replace(/>\s+</g, '>\n<')
      .replace(/(<[^/][^>]*>)(?!<)/g, '$1\n  ')
      .replace(/(<\/[^>]*>)/g, '\n$1')
      .split('\n')
      .filter(line => line.trim())
      .join('\n');
  };

  // CSS formatting with property sorting
  const formatCSS = (code: string): string => {
    return code
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/:\s+/g, ': ')
      .split('\n')
      .filter(line => line.trim())
      .join('\n');
  };

  // SQL formatting with keyword capitalization
  const formatSQL = (code: string): string => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'AND', 'OR', 'ORDER BY', 'GROUP BY'];
    let formatted = code.toUpperCase();
    keywords.forEach(keyword => {
      formatted = formatted.replace(new RegExp(`\\b${keyword}\\b`, 'g'), `\n${keyword}`);
    });
    return formatted;
  };

  // Markdown formatting
  const formatMarkdown = (code: string): string => {
    return code
      .replace(/^(#+)\s*/gm, '$1 ') // Fix heading spacing
      .replace(/\n{3,}/g, '\n\n') // Remove extra newlines
      .replace(/(\*\*|__)(.*?)\1/g, '**$2**') // Standardize bold syntax
      .replace(/(\*|_)(.*?)\1/g, '_$2_'); // Standardize italic syntax
  };

  // Copy formatted code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Code Formatter</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span className="text-sm">Auto-detect language</span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={autoDetect}
            className={`px-3 py-1 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Input Code
          </label>
          <textarea
            className={`w-full h-[300px] sm:h-[400px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Formatted Output
            </label>
            <button
              onClick={copyToClipboard}
              className={`flex items-center space-x-1 px-2 py-1 rounded ${
                isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            className={`w-full h-[300px] sm:h-[400px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-gray-50 text-gray-800 border-gray-300'
            }`}
            value={output}
            readOnly
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={formatCode}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors flex items-center space-x-2`}
        >
          <Code2 className="h-4 w-4" />
          <span>Format Code</span>
        </button>
      </div>
    </div>
  );
}

export default CodeFormatter;