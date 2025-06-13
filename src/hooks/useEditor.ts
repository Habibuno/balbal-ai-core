import * as esbuild from 'esbuild-wasm';
import { default as parserBabel } from 'prettier/parser-babel';
import parserTs from 'prettier/parser-typescript';
import prettier from 'prettier/standalone';
import { useEffect, useState } from 'react';

import type { EditorState } from '../types/editor';
import { generateCodeWithOpenAI } from '../utils/openai';

let esbuildInitPromise: Promise<void> | null = null;
let isInitializing = false;
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

async function initializeEsbuild(): Promise<void> {
	if (esbuildInitPromise) return esbuildInitPromise;
	if (isInitializing) {
		return new Promise((resolve) => {
			const checkInterval = setInterval(() => {
				if (esbuildInitPromise) {
					clearInterval(checkInterval);
					resolve(esbuildInitPromise);
				}
			}, 100);
		});
	}

	isInitializing = true;

	try {
		esbuildInitPromise = esbuild.initialize({
			wasmURL: 'https://unpkg.com/esbuild-wasm@0.25.5/esbuild.wasm',
			worker: false,
		});

		await esbuildInitPromise;
		return esbuildInitPromise;
	} catch (error) {
		esbuildInitPromise = null;
		isInitializing = false;
		throw error;
	}
}

export function useEditor() {
	const [state, setState] = useState<EditorState>({
		previewHtml: '',
		selectedFile: 'src/App.tsx',
		files: {
			'src/App.tsx': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome to BalBal.io!</Text>
      <Text style={styles.subtitle}>
        Start building your mobile app by editing this file.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    height: 600,
    width: '100%',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#0ff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
});`,
		},
		isGenerating: false,
		consoleMessages: [
			{ id: generateUniqueId(), message: '🚀 Initializing development environment...' },
			{ id: generateUniqueId(), message: '✨ Dependencies installed successfully' },
			{ id: generateUniqueId(), message: '🔧 Babel transpile ready' },
			{ id: generateUniqueId(), message: '🎯 React runtime loaded' },
		],
		prompt: '',
		esbuildReady: false,
	});

	useEffect(() => {
		let mounted = true;

		const initEsbuild = async () => {
			try {
				await initializeEsbuild();

				if (!mounted) return;

				setState((prev) => ({
					...prev,
					esbuildReady: true,
					consoleMessages: [...prev.consoleMessages, {
						id: generateUniqueId(),
						message: '🛠️ esbuild initialized',
					}],
				}));
			} catch (err) {
				if (!mounted) return;

				console.error('Esbuild init failed:', err);
				setState((prev) => ({
					...prev,
					consoleMessages: [...prev.consoleMessages, {
						id: generateUniqueId(),
						message: `❌ Esbuild initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
					}],
				}));
			}
		};

		initEsbuild();

		return () => {
			mounted = false;
		};
	}, []);

	const createVirtualFilePlugin = (files: Record<string, string>) => ({
		name: 'virtual-fs',
		setup(build: esbuild.PluginBuild) {
			build.onResolve({ filter: /.*/ }, (args) => {
				if (
					args.path.startsWith('./') ||
					args.path.startsWith('../') ||
					args.path.startsWith('src/')
				) {
					let resolvedPath = new URL(args.path, `file://${args.resolveDir}/`).pathname.slice(1);

					if (!/\.\w+$/.test(resolvedPath)) {
						if (files[`${resolvedPath}.tsx`]) resolvedPath += '.tsx';
						else if (files[`${resolvedPath}.ts`]) resolvedPath += '.ts';
						else if (files[`${resolvedPath}.js`]) resolvedPath += '.js';
						else if (files[`${resolvedPath}.jsx`]) resolvedPath += '.jsx';
					}

					return { path: resolvedPath, namespace: 'virtual' };
				}

				// Externals (libs tierces)
				return { path: args.path, external: true };
			});

			build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
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
		if (!state.esbuildReady) {
			await initializeEsbuild();
			setState((prev) => ({ ...prev, esbuildReady: true }));
		}

		try {
			return await esbuild.build({
				entryPoints: [entry],
				bundle: true,
				plugins: [createVirtualFilePlugin(allFiles)],
				write: false,
				jsx: 'transform',
				jsxFactory: 'React.createElement',
				jsxFragment: 'React.Fragment',
				target: 'esnext',
				platform: 'browser',
				format: 'iife',
				globalName: 'AppBundle',
				define: { 'process.env.NODE_ENV': '"development"' },
				loader: { '.js': 'jsx', '.jsx': 'jsx', '.ts': 'tsx', '.tsx': 'tsx' },
			});
		} catch (error) {
			console.error('Compilation error:', error);
			throw error;
		}
	};

	function dedupeImports(code: string): string {
		const seen = new Set<string>();

		return code
			.split('\n')
			.filter((line) => {
				const match = line.match(/^import\s.+?from\s+['"](.+?)['"]/);
				if (!match) return true;
				if (seen.has(match[0])) return false;
				seen.add(match[0]);
				return true;
			})
			.join('\n');
	}

	const handleGenerateWithAI = async (): Promise<void> => {
		if (!state.prompt.trim() || state.isGenerating) return;

		if (!import.meta.env.VITE_OPENAI_API_KEY) {
			const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			setState((prev) => ({
				...prev,
				consoleMessages: [...prev.consoleMessages, {
					id,
					message: '❌ La clé API OpenAI n\'est pas configurée. Veuillez ajouter VITE_OPENAI_API_KEY dans votre fichier .env',
				}],
			}));
			return;
		}

		setState((prev) => ({ ...prev, isGenerating: true }));

		const id = `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		setState((prev) => ({
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
					.filter((char) => {
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
				} catch {
					const fileEntries = cleanedResponse.match(/"([^"]+)":\s*"([^"]*)(?<!\\)"/g);
					if (fileEntries) {
						files = {};
						for (const entry of fileEntries) {
							const match = entry.match(/"([^"]+)":\s*"([^"]*)(?<!\\)"/);
							if (match) {
								const [, filename, content] = match;
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
				const dedupedCode = dedupeImports(value);

				try {
					const ext = filePath.split('.').pop();
					const parser = ext === 'ts' || ext === 'tsx' ? 'typescript' : 'babel';

					const formatted = prettier.format(dedupedCode, {
						parser,
						plugins: [parserBabel, parserTs],
						semi: true,
						singleQuote: true,
						trailingComma: 'es5',
						tabWidth: 2,
						printWidth: 80,
					});

					unformattedFiles[filePath] = await formatted;
				} catch (error) {
					console.error('Error formatting code:', error);
					unformattedFiles[filePath] = dedupedCode;
				}
			}

			setState((prev) => ({
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
			setState((prev) => ({
				...prev,
				consoleMessages: [...prev.consoleMessages, {
					id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					message: `❌ ${error instanceof Error ? error.message : 'Failed to generate code'}`,
				}],
			}));
		} finally {
			setState((prev) => ({ ...prev, isGenerating: false }));
		}
	};

	return {
		state,
		setState,
		compileProject,
		dedupeImports,
		handleGenerateWithAI,
	};
}