import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

const EncoderDecoder: React.FC<Props> = ({ isDarkMode }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'base64' | 'url'>('base64');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      if (mode === 'base64') {
        setOutput(btoa(input));
      } else {
        setOutput(encodeURIComponent(input));
      }
    } catch (error) {
      setOutput('Error encoding text');
    }
  };

  const decode = () => {
    try {
      if (mode === 'base64') {
        setOutput(atob(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (error) {
      setOutput('Error decoding text');
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
      <h2 className="text-xl font-semibold">Encoder/Decoder</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMode('base64')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'base64'
              ? 'bg-indigo-600 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Base64
        </button>
        <button
          onClick={() => setMode('url')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'url'
              ? 'bg-indigo-600 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          URL
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Input Text
          </label>
          <textarea
            className={`w-full h-[300px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode/decode..."
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
            className={`w-full h-[300px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-gray-50 text-gray-800 border-gray-300'
            }`}
            value={output}
            readOnly
          />
        </div>
      </div>
      <div className="space-x-4">
        <button
          onClick={encode}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors`}
        >
          Encode
        </button>
        <button
          onClick={decode}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors`}
        >
          Decode
        </button>
      </div>
    </div>
  );
};

export default EncoderDecoder;