import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

// HashGenerator component provides various hash generation methods
function HashGenerator({ isDarkMode }: Props) {
  const [input, setInput] = useState('');
  const [hashType, setHashType] = useState<'md5' | 'sha1' | 'sha256' | 'sha512'>('md5');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate hash based on selected algorithm
  const generateHash = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      let hash: ArrayBuffer;
      switch (hashType) {
        case 'sha1':
          hash = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hash = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha512':
          hash = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          // For MD5, we'll use a simple implementation since it's not available in Web Crypto API
          setOutput(calculateMD5(input));
          return;
      }

      const hashArray = Array.from(new Uint8Array(hash));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashHex);
    } catch (error) {
      setOutput('Error generating hash');
    }
  };

  // Simple MD5 implementation (for demonstration purposes)
  const calculateMD5 = (str: string): string => {
    // This is a placeholder - in a real application, you'd want to use a proper MD5 implementation
    return 'MD5 hash placeholder - use a proper implementation in production';
  };

  // Copy hash to clipboard
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
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Hash Generator</h2>
        <select
          value={hashType}
          onChange={(e) => setHashType(e.target.value as 'md5' | 'sha1' | 'sha256' | 'sha512')}
          className={`px-3 py-1 rounded-lg ${
            isDarkMode
              ? 'bg-gray-700 text-gray-100'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <option value="md5">MD5</option>
          <option value="sha1">SHA-1</option>
          <option value="sha256">SHA-256</option>
          <option value="sha512">SHA-512</option>
        </select>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Input Text
          </label>
          <textarea
            className={`w-full h-[150px] p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
          />
        </div>

        <button
          onClick={generateHash}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors`}
        >
          Generate Hash
        </button>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Generated Hash
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
          <input
            type="text"
            className={`w-full p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-gray-50 text-gray-800 border-gray-300'
            }`}
            value={output}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;