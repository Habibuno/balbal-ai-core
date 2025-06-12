import { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/parser-babel';
import { generateCodeWithOpenAI } from '../../utils/openai';

export interface ConsoleMessage {
  id: string;
  message: string;
}

export interface EditorState {
  selectedFile: string;
  files: Record<string, string>;
  isGenerating: boolean;
  consoleMessages: ConsoleMessage[];
  prompt: string;
  esbuildReady: boolean;
}

export const useEditor = () => {
  const [state, setState] = useState<EditorState>({
    selectedFile: 'src/App.tsx',
    files: {
      'src/App.tsx': `export default function App() {
        return (
          <div className="p-4 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Welcome to BalBal.io! 👋
              </h1>
              
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-cyan-400">Getting Started</h2>
                  <p className="text-gray-300">
                    Start by describing your app idea in the AI assistant panel.
                    We'll help you create a beautiful, functional mobile application!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }`,
    },
    isGenerating: false,
    consoleMessages: [
      { id: 'init-1', message: '🚀 Initializing development environment...' },
      { id: 'init-2', message: '✨ Dependencies installed successfully' },
      { id: 'init-3', message: '🔧 Babel transpile ready' },
      { id: 'init-4', message: '🎯 React runtime loaded' },
    ],
    prompt: '',
    esbuildReady: false,
  });

  const initRef = useRef(false);

  useEffect(() => {
    const initEsbuild = async () => {
      if (initRef.current || state.esbuildReady) return;

      try {
        await esbuild.initialize({
          wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.8/esbuild.wasm',
          worker: false,
        });
        initRef.current = true;
        setState(prev => ({ ...prev, esbuildReady: true }));
        setState(prev => ({
          ...prev,
          consoleMessages: [...prev.consoleMessages, {
            id: `init-${Date.now()}`,
            message: '🛠️ esbuild initialized',
          }],
        }));
      } catch (err) {
        console.error('Esbuild init failed:', err);
        setState(prev => ({
          ...prev,
          consoleMessages: [...prev.consoleMessages, {
            id: `error-${Date.now()}`,
            message: `❌ Esbuild initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          }],
        }));
      }
    };

    initEsbuild();

    return () => {
      if (initRef.current) {
        esbuild.stop?.();
      }
    };
  }, [state.esbuildReady]);

  const createVirtualFilePlugin = (files: Record<string, string>) => ({
    name: 'virtual-fs',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, args => {
        if (args.path.startsWith('./') || args.path.startsWith('../') || args.path.startsWith('src/')) {
          const resolvedPath = new URL(args.path, `file://${args.resolveDir}/`).pathname.slice(1);
          return { path: resolvedPath, namespace: 'virtual' };
        }
        return { path: args.path, external: true };
      });

      build.onLoad({ filter: /.*/, namespace: 'virtual' }, args => {
        const path = args.path.startsWith('src/') ? args.path : `src/${args.path}`;
        const fileContent = files[path];
        if (!fileContent) return;

        return {
          contents: fileContent,
          loader: path.endsWith('.ts') || path.endsWith('.tsx') ? 'tsx' : 'js',
        };
      });
    },
  });

  const compileProject = async (entry: string, allFiles: Record<string, string>) => {
    if (!state.esbuildReady) throw new Error('esbuild is not ready');

    const result = await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      write: false,
      plugins: [createVirtualFilePlugin(allFiles)],
      format: 'esm',
      jsx: 'automatic',
      target: 'esnext',
      platform: 'browser',
      sourcemap: false,
    });

    return result.outputFiles[0].text;
  };

  const formatCode = async (code: string) => {
    try {
      const formattedCode = await prettier.format(code, {
        parser: 'babel',
        plugins: [parserBabel, '@trivago/prettier-plugin-sort-imports'],
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2,
        useTabs: true,
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'avoid',
        endOfLine: 'auto',
        importOrder: ['^react', '^@react-navigation', '^react-native', '^[./]'],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
      });
      return formattedCode;
    } catch (error) {
      console.error('Error formatting code:', error);
      return code;
    }
  };

  const handleGenerateWithAI = async () => {
    if (!state.prompt.trim() || state.isGenerating) return;

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setState(prev => ({
        ...prev,
        consoleMessages: [...prev.consoleMessages, {
          id,
          message: '❌ La clé API OpenAI n\'est pas configurée. Veuillez ajouter VITE_OPENAI_API_KEY dans votre fichier .env',
        }],
      }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));
    const id = `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setState(prev => ({
      ...prev,
      consoleMessages: [...prev.consoleMessages, {
        id,
        message: `🤖 Generating code with AI... (${new Date().toLocaleTimeString()})`,
      }],
    }));

    try {
      const response = await generateCodeWithOpenAI(state.prompt);
      let files: Record<string, string>;

      if (typeof response === 'object' && response !== null) {
        files = response as Record<string, string>;
      } else if (typeof response === 'string') {
        const cleanedResponse = response
          .split('')
          .filter(char => {
            const code = char.charCodeAt(0);
            return code >= 32 && code !== 127;
          })
          .join('')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\n\s*\n/g, '\n')
          .trim();

        try {
          const parsedResponse = JSON.parse(cleanedResponse);
          if (typeof parsedResponse === 'object' && parsedResponse !== null) {
            files = parsedResponse;
          } else {
            throw new Error('Parsed response is not an object');
          }
        } catch (parseError) {
          const fileEntries = cleanedResponse.match(/"([^"]+)":\s*"([^"]*)(?<!\\)"/g);
          if (fileEntries) {
            files = {};
            for (const entry of fileEntries) {
              const match = entry.match(/"([^"]+)":\s*"([^"]*)(?<!\\)"/);
              if (match) {
                const [_, filename, content] = match;
                const cleanedContent = content
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '\r')
                  .replace(/\\t/g, '\t')
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, '\\');
                files[filename] = cleanedContent;
              }
            }
          } else {
            files = { 'App.tsx': cleanedResponse };
          }
        }
      } else {
        throw new TypeError('Invalid response format');
      }

      const unformattedFiles: Record<string, string> = {};
      for (const [key, value] of Object.entries(files)) {
        const filePath = key.startsWith('src/') ? key : `src/${key}`;
        const formattedCode = await formatCode(value);
        unformattedFiles[filePath] = formattedCode;
      }

      setState(prev => ({
        ...prev,
        files: { ...prev.files, ...unformattedFiles },
        selectedFile: Object.keys(unformattedFiles)[0] || prev.selectedFile,
        prompt: '',
        consoleMessages: [...prev.consoleMessages, {
          id: `success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: `✨ Generated ${Object.keys(unformattedFiles).length} files at ${new Date().toLocaleTimeString()}`,
        }],
      }));
    } catch (error) {
      console.error('Error generating code:', error);
      setState(prev => ({
        ...prev,
        consoleMessages: [...prev.consoleMessages, {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: `❌ ${error instanceof Error ? error.message : 'Failed to generate code'}`,
        }],
      }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return {
    state,
    setState,
    compileProject,
    handleGenerateWithAI,
  };
}; 