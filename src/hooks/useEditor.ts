import * as esbuild from 'esbuild-wasm';
import { useEffect, useState } from 'react';

import type { EditorState } from '../types/editor';
import { createVirtualFilePlugin, dedupeImports, generateUniqueId, initializeEsbuild } from '../utils/editor';
import { generateCodeWithOpenAI } from '../utils/openai';

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

	const handleGenerateWithAI = async (prompt: string, currentCode?: string, isFirstRequest = false) => {
		try {
			if (!import.meta.env.VITE_OPENAI_API_KEY) {
				throw new Error('OpenAI API key not configured');
			}

			setState(prev => ({
				...prev,
				isGenerating: true,
				consoleMessages: [
					...prev.consoleMessages,
					{ id: generateUniqueId(), message: '🤖 Generating code with AI...' },
				],
			}));

			const response = await generateCodeWithOpenAI(prompt, {
				model: 'gpt-4o-mini',
				temperature: 0.7,
				maxTokens: 6000,
			}, isFirstRequest, currentCode || '');

			setState(prev => ({
				...prev,
				isGenerating: false,
				consoleMessages: [
					...prev.consoleMessages,
					{ id: generateUniqueId(), message: '✅ Code generated successfully' },
				],
			}));

			return response;
		} catch (error) {
			setState(prev => ({
				...prev,
				isGenerating: false,
				consoleMessages: [
					...prev.consoleMessages,
					{
						id: generateUniqueId(),
						message: `❌ Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`,
					},
				],
			}));
			throw error;
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