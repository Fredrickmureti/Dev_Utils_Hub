import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

const JsonTools: React.FC<Props> = ({ isDarkMode }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError('Valid JSON ✓');
      setOutput(input);
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

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
      <h2 className="text-xl font-semibold">JSON Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Input JSON
          </label>
          <textarea
            className={`w-full h-[400px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Output
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
            className={`w-full h-[400px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-gray-50 text-gray-800 border-gray-300'
            }`}
            value={output}
            readOnly
          />
        </div>
      </div>
      {error && (
        <div className={`text-sm ${error.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
          {error}
        </div>
      )}
      <div className="space-x-4">
        <button
          onClick={formatJson}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors`}
        >
          Format JSON
        </button>
        <button
          onClick={validateJson}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors`}
        >
          Validate JSON
        </button>
      </div>
    </div>
  );
};

export default JsonTools;