import React, { useState } from 'react';
import { Copy, Check, Terminal, Search } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

// Enhanced CliGenerator with more command templates and smart suggestions
function CliGenerator({ isDarkMode }: Props) {
  const [commandType, setCommandType] = useState('git');
  const [options, setOptions] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // Enhanced command templates with descriptions and examples
  const commandTemplates = {
    git: {
      clone: {
        template: 'git clone {repository} {directory}',
        description: 'Clone a repository into a new directory',
        example: 'git clone https://github.com/user/repo.git ./my-project'
      },
      branch: {
        template: 'git checkout -b {branch-name}',
        description: 'Create and switch to a new branch',
        example: 'git checkout -b feature/new-feature'
      },
      commit: {
        template: 'git commit -m "{message}"',
        description: 'Record changes to the repository',
        example: 'git commit -m "Add new feature"'
      },
      stash: {
        template: 'git stash push -m "{message}"',
        description: 'Stash changes with a descriptive message',
        example: 'git stash push -m "WIP: feature implementation"'
      },
      rebase: {
        template: 'git rebase -i HEAD~{number}',
        description: 'Interactive rebase for commit squashing',
        example: 'git rebase -i HEAD~3'
      }
    },
    docker: {
      run: {
        template: 'docker run -d -p {port}:{container-port} --name {container-name} {image}',
        description: 'Run a container in detached mode',
        example: 'docker run -d -p 3000:3000 --name myapp node:latest'
      },
      build: {
        template: 'docker build -t {tag} --build-arg {arg-name}={arg-value} .',
        description: 'Build an image with build arguments',
        example: 'docker build -t myapp:latest --build-arg NODE_ENV=production .'
      },
      compose: {
        template: 'docker-compose -f {compose-file} up -d',
        description: 'Start services defined in a compose file',
        example: 'docker-compose -f docker-compose.prod.yml up -d'
      },
      prune: {
        template: 'docker system prune --volumes -f',
        description: 'Remove unused data',
        example: 'docker system prune --volumes -f'
      }
    },
    npm: {
      install: {
        template: 'npm install {package}@{version} --save-{type}',
        description: 'Install a package with specific version',
        example: 'npm install react@latest --save-prod'
      },
      script: {
        template: 'npm run {script} -- --{flag}={value}',
        description: 'Run a script with additional flags',
        example: 'npm run build -- --mode=production'
      },
      publish: {
        template: 'npm publish --tag {tag}',
        description: 'Publish package with a specific tag',
        example: 'npm publish --tag beta'
      },
      audit: {
        template: 'npm audit fix --force',
        description: 'Fix security vulnerabilities',
        example: 'npm audit fix --force'
      }
    },
    kubernetes: {
      apply: {
        template: 'kubectl apply -f {file} --namespace {namespace}',
        description: 'Apply a configuration to a resource',
        example: 'kubectl apply -f deployment.yaml --namespace production'
      },
      logs: {
        template: 'kubectl logs {pod} -c {container} --tail {lines} -f',
        description: 'Stream the logs from a container',
        example: 'kubectl logs myapp-pod -c main --tail 100 -f'
      },
      port: {
        template: 'kubectl port-forward {pod} {local-port}:{pod-port}',
        description: 'Forward local port to pod port',
        example: 'kubectl port-forward myapp-pod 8080:80'
      }
    }
  };

  // Filter commands based on search term
  const filteredCommands = React.useMemo(() => {
    if (!searchTerm) return commandTemplates;
    
    const filtered: any = {};
    Object.entries(commandTemplates).forEach(([category, commands]) => {
      const matchingCommands: any = {};
      Object.entries(commands).forEach(([name, data]) => {
        if (
          name.includes(searchTerm.toLowerCase()) ||
          data.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          matchingCommands[name] = data;
        }
      });
      if (Object.keys(matchingCommands).length > 0) {
        filtered[category] = matchingCommands;
      }
    });
    return filtered;
  }, [searchTerm]);

  // Generate command based on selected template and options
  const generateCommand = () => {
    try {
      const selectedTemplate = commandTemplates[commandType][options.subcommand];
      let command = selectedTemplate.template;
      
      // Replace placeholders with actual values
      Object.entries(options).forEach(([key, value]) => {
        command = command.replace(`{${key}}`, value);
      });

      setOutput(command);
      
      // Add to history if not already present
      if (!commandHistory.includes(command)) {
        setCommandHistory(prev => [command, ...prev].slice(0, 10));
      }
    } catch (error) {
      setOutput('Error generating command');
    }
  };

  // Copy command to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Update options based on command type
  const handleCommandTypeChange = (type: string) => {
    setCommandType(type);
    setOptions({ subcommand: Object.keys(commandTemplates[type])[0] });
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">CLI Command Generator</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-800'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Command Type
          </label>
          <select
            value={commandType}
            onChange={(e) => handleCommandTypeChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {Object.keys(filteredCommands).map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Subcommand
          </label>
          <select
            value={options.subcommand || ''}
            onChange={(e) => setOptions({ ...options, subcommand: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {Object.keys(filteredCommands[commandType] || {}).map((cmd) => (
              <option key={cmd} value={cmd}>
                {cmd}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Command description and example */}
      {options.subcommand && (
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className="text-sm mb-2">
            {commandTemplates[commandType][options.subcommand].description}
          </p>
          <p className="text-sm font-mono">
            Example: {commandTemplates[commandType][options.subcommand].example}
          </p>
        </div>
      )}

      {/* Dynamic options based on selected command */}
      {options.subcommand && (
        <div className="space-y-4">
          {commandTemplates[commandType][options.subcommand].template
            .match(/{([^}]+)}/g)
            ?.map((placeholder) => {
              const field = placeholder.replace(/[{}]/g, '');
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2">
                    {field.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={options[field] || ''}
                    onChange={(e) => setOptions({ ...options, [field]: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-100 border-gray-600'
                        : 'bg-white text-gray-800 border-gray-300'
                    }`}
                    placeholder={`Enter ${field.replace(/-/g, ' ')}`}
                  />
                </div>
              );
            })}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={generateCommand}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white rounded-lg transition-colors flex items-center space-x-2`}
        >
          <Terminal className="h-4 w-4" />
          <span>Generate Command</span>
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-4 py-2 ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-100 hover:bg-gray-200'
          } rounded-lg transition-colors`}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Generated Command
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
          <div
            className={`w-full p-3 border rounded-lg font-mono text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-gray-50 text-gray-800 border-gray-300'
            }`}
          >
            {output}
          </div>
        </div>
      )}

      {/* Command History */}
      {showHistory && commandHistory.length > 0 && (
        <div className={`mt-4 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h3 className="text-lg font-semibold mb-2">Command History</h3>
          <div className="space-y-2">
            {commandHistory.map((cmd, index) => (
              <div
                key={index}
                className={`p-2 rounded cursor-pointer ${
                  isDarkMode
                    ? 'hover:bg-gray-600'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setOutput(cmd)}
              >
                <code className="text-sm">{cmd}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CliGenerator;