import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Tab } from '@headlessui/react';
import CodeMirror from '@uiw/react-codemirror';
import { clsx } from 'clsx';
import {
	ArrowLeft,
	CheckCheck,
	Code2,
	Copy,
	Eye,
	FolderTree,
	Loader2,
	Maximize2,
	Play,
	Settings,
	Terminal,
	Wand2,
} from 'lucide-react';
import * as parserBabel from 'prettier/parser-babel';
import * as prettier from 'prettier/standalone';
import type React from 'react';
import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { generateCodeWithOpenAI } from '../utils/openai';
import { Button } from './ui/Button';

export const Create: React.FC = () => {
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
	const [files, setFiles] = useState<Record<string, string>>({
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
	});
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [consoleMessages, setConsoleMessages] = useState<Array<{ id: string; message: string }>>([
		{ id: 'init-1', message: '🚀 Initializing development environment...' },
		{ id: 'init-2', message: '✨ Dependencies installed successfully' },
		{ id: 'init-3', message: '🔧 Babel transpile ready' },
		{ id: 'init-4', message: '🎯 React runtime loaded' },
	]);
	const [prompt, setPrompt] = useState('');

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(files[selectedFile]);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	const formatCode = async (code: string) => {
		try {
			const formattedCode = await prettier.format(code, {
				parser: 'babel',
				plugins: [parserBabel],
				semi: true,
				singleQuote: true,
				trailingComma: 'es5',
				printWidth: 80,
				tabWidth: 2,
				useTabs: true,
			});
			return formattedCode;
		} catch (error) {
			console.error('Error formatting code:', error);
			return code;
		}
	};

	const handleExecute = async () => {
		const id = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		setConsoleMessages((prev) => [...prev, { id, message: `🔄 Executing code... (${new Date().toLocaleTimeString()})` }]);

		try {
			const currentFile = files[selectedFile];

			if (!currentFile) {
				throw new Error('No file selected');
			}

			// Format the code before execution
			const formattedCode = await formatCode(currentFile);
			setFiles((prev) => ({ ...prev, [selectedFile]: formattedCode }));

			const previewFrame = document.createElement('iframe');
			previewFrame.style.display = 'none';
			document.body.appendChild(previewFrame);

			// Transform the code to avoid module issues
			const transformedCode = formattedCode
				.replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
				.replace(/export\s+default\s+const\s+(\w+)/, 'const $1')
				.replace(/export\s+default\s+(\w+)/, 'const $1');

			const htmlContent = `
				<!DOCTYPE html>
				<html>
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
						<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
						<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
						<script src="https://cdn.tailwindcss.com"></script>
						<style>
							body { margin: 0; padding: 0; }
							#root { min-height: 100vh; }
						</style>
					</head>
					<body>
						<div id="root"></div>
						<script type="text/babel">
							const { useState, useEffect } = React;
							${transformedCode}
							
							// Render the app
							const root = document.getElementById('root');
							ReactDOM.createRoot(root).render(React.createElement(App));
						</script>
					</body>
				</html>
			`;

			const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow?.document;

			if (frameDoc) {
				frameDoc.open();
				frameDoc.write(htmlContent);
				frameDoc.close();

				// Log success
				setConsoleMessages((prev) => [...prev, {
					id: `success-${Date.now()}`,
					message: '✅ Code executed successfully',
				}]);

				setTimeout(() => {
					document.body.removeChild(previewFrame);
				}, 1000);
			}
		} catch (error) {
			setConsoleMessages((prev) => [...prev, {
				id: `error-${Date.now()}`,
				message: `❌ Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}`,
			}]);
		}
	};

	const handleGenerateWithAI = async () => {
		if (!prompt.trim() || isGenerating) return;

		if (!import.meta.env.VITE_OPENAI_API_KEY) {
			const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			setConsoleMessages((prev) => [...prev, { id, message: '❌ La clé API OpenAI n\'est pas configurée. Veuillez ajouter VITE_OPENAI_API_KEY dans votre fichier .env' }]);
			return;
		}

		setIsGenerating(true);
		const id = `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		setConsoleMessages((prev) => [...prev, { id, message: `🤖 Generating code with AI... (${new Date().toLocaleTimeString()})` }]);

		try {
			const response = await generateCodeWithOpenAI(prompt);
			console.warn('Raw API Response:', response);
			console.warn('Response type:', typeof response);

			let files: Record<string, string>;

			if (typeof response === 'object' && response !== null) {
				console.warn('Response is already an object, using it directly');
				files = response as Record<string, string>;
			} else if (typeof response === 'string') {
				console.warn('Response is a string, attempting to parse it');
				try {
					// Nettoyer la chaîne de réponse avant de la parser
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

					console.warn('Cleaned response:', cleanedResponse);

					try {
						const parsedResponse = JSON.parse(cleanedResponse);
						if (typeof parsedResponse === 'object' && parsedResponse !== null) {
							console.warn('Parsed response is an object');
							files = parsedResponse;
						} else {
							console.warn('Parsed response is not an object');
							throw new Error('Parsed response is not an object');
						}
					} catch (parseError) {
						console.warn('Parse error:', parseError);
						console.warn('Attempting to parse manually...');

						const fileEntries = cleanedResponse.match(/"([^"]+)":\s*"([^"]*)(?<!\\)"/g);
						if (fileEntries) {
							files = {};

							for (const entry of fileEntries) {
								const match = entry.match(/"([^"]+)":\s*"([^"]*)(?<!\\)"/);

								if (match) {
									const [_, filename, content] = match;
									console.warn('Found file:', filename);

									const cleanedContent = content
										.replace(/\\n/g, '\n')
										.replace(/\\r/g, '\r')
										.replace(/\\t/g, '\t')
										.replace(/\\"/g, '"')
										.replace(/\\\\/g, '\\');

									files[filename] = cleanedContent;
									console.warn('File content length:', cleanedContent.length);
								}
							}
						} else {
							console.warn('No files found in response, using as App.tsx');
							files = { 'App.tsx': cleanedResponse };
						}
					}
				} catch (e) {
					console.warn('Parse error:', e);
					console.warn('Using raw response as App.tsx');
					files = { 'App.tsx': response };
				}
			} else {
				throw new TypeError('Invalid response format');
			}

			console.warn('Final files object:', files);

			const unformattedFiles: Record<string, string> = {};

			for (const [key, value] of Object.entries(files)) {
				const filePath = key.startsWith('src/') ? key : `src/${key}`;
				// Transform React Native imports to web components
				const processedContent = value
					.replace(/import\s*\{[^}]*\}\s*from\s*['"]react-native['"]/g, (match) => {
						const imports = match.match(/\{([^}]*)\}/)?.[1] || '';
						return imports.split(',').map((c: string) => `const ${c.trim()} = 'div';`).join('\n');
					})
					.replace(/import[^;]*from\s*['"]react-native['"]/g, '')
					.replace(/import[^;]*from\s*['"]@react-navigation\/[^'"]*['"]/g, '')
					.replace(/import[^;]*from\s*['"]react-native-safe-area-context['"]/g, '')
					.replace(/require\(['"][^'"]*['"]\)/g, '')
					.replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
					.replace(/export\s+default\s+const\s+(\w+)/, 'const $1')
					.replace(/export\s+default\s+(\w+)/, 'const $1')
					.replace(/View/g, 'div')
					.replace(/Text/g, 'p')
					.replace(/TouchableOpacity/g, 'button')
					.replace(/StyleSheet\.create\(([^)]*)\)/g, (_, styles) => {
						return styles.replace(/(\w+):\s*\{([^}]*)\}/g, (_: string, key: string, value: string) => {
							return `"${key}": {${value}}`;
						});
					})
					.replace(/style=\{styles\.(\w+)\}/g, 'className="$1"')
					.replace(/onPress/g, 'onClick');

				unformattedFiles[filePath] = processedContent;
			}

			// Formatter automatiquement tous les fichiers
			const formattedFiles: Record<string, string> = {};
			for (const [filePath, code] of Object.entries(unformattedFiles)) {
				formattedFiles[filePath] = await formatCode(code);
			}

			setFiles((prevFiles) => ({
				...prevFiles,
				...formattedFiles,
			}));

			const firstFile = Object.keys(formattedFiles)[0];
			if (firstFile) {
				setSelectedFile(firstFile);
			}

			const successId = `success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			setConsoleMessages((prev) => [...prev, {
				id: successId,
				message: `✨ Generated ${Object.keys(formattedFiles).length} files at ${new Date().toLocaleTimeString()}`,
			}]);
			setPrompt('');
		} catch (error) {
			console.error('Error generating code:', error);

			const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			setConsoleMessages((prev) => [...prev, { id: errorId, message: `❌ ${error instanceof Error ? error.message : 'Failed to generate code'}` }]);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black to-[#111]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-800 bg-black/50 p-4 backdrop-blur-sm">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						onClick={() => navigate('/')}
						icon={<ArrowLeft className="h-5 w-5" />}
						size="sm"
					>
						Retour
					</Button>
					<h1 className="text-xl font-semibold text-white">BalBal.io Editor</h1>
				</div>
				<Button variant="outline" size="sm" icon={<Settings className="h-4 w-4" />}>
					Settings
				</Button>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
				{/* Sidebar */}
				<div className="w-full overflow-y-auto border-r border-gray-800 bg-[#1f1f1f] p-4 lg:w-64 lg:min-w-64">
					<h2 className="mb-4 text-sm font-semibold text-gray-400">FILES</h2>
					<div className="space-y-2">
						{Object.keys(files).map((path) => (
							<Button
								key={path}
								onClick={() => setSelectedFile(path)}
								className={clsx(
									'flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors',
									selectedFile === path
										? 'bg-gray-800 text-white'
										: 'text-gray-400 hover:bg-gray-800/50'
								)}
							>
								<FolderTree className="h-4 w-4" />
								{path}
							</Button>
						))}
					</div>

					<div className="mt-8 space-y-4">
						<h2 className="text-sm font-semibold text-gray-400">AI ASSISTANT</h2>
						<div className="space-y-2">
							<textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder="Décris ton idée d'application..."
								className="h-32 w-full resize-none rounded-xl border border-gray-800 bg-[#111] p-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
							/>
							<Button
								onClick={handleGenerateWithAI}
								disabled={!prompt.trim() || isGenerating}
								className="w-full"
								icon={
									isGenerating ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Wand2 className="h-4 w-4" />
									)
								}
							>
								{isGenerating ? 'Génération...' : 'Générer avec l\'IA'}
							</Button>
						</div>
					</div>
				</div>

				{/* Editor and Preview */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<Tab.Group>
						<Tab.List className="flex border-b border-gray-800 bg-black/30">
							<Tab
								className={({ selected }) =>
									clsx(
										'px-4 py-2 text-sm font-medium focus:outline-none',
										selected
											? 'border-b-2 border-cyan-400 text-white'
											: 'text-gray-400 hover:text-gray-300'
									)}
							>
								<div className="flex items-center gap-2">
									<Code2 className="h-4 w-4" />
									Code
								</div>
							</Tab>
							<Tab
								className={({ selected }) =>
									clsx(
										'px-4 py-2 text-sm font-medium focus:outline-none',
										selected
											? 'border-b-2 border-cyan-400 text-white'
											: 'text-gray-400 hover:text-gray-300'
									)}
							>
								<div className="flex items-center gap-2">
									<Eye className="h-4 w-4" />
									Preview
								</div>
							</Tab>
						</Tab.List>

						<Tab.Panels className="flex-1">
							<Tab.Panel className="h-full p-4">
								<div className="mb-4 flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopy}
										icon={
											copied ? (
												<CheckCheck className="h-4 w-4 text-green-500" />
											) : (
												<Copy className="h-4 w-4" />
											)
										}
									>
										{copied ? 'Copié !' : 'Copier'}
									</Button>
									<Button size="sm" onClick={handleExecute} icon={<Play className="h-4 w-4" />}>
										Exécuter
									</Button>
								</div>
								<div className="h-[calc(100%-3rem)] overflow-hidden rounded-xl border border-gray-800">
									<CodeMirror
										value={files[selectedFile]}
										height="100%"
										theme={oneDark}
										extensions={[javascript({ jsx: true, typescript: selectedFile.endsWith('.tsx') || selectedFile.endsWith('.ts') })]}
										onChange={(value) => {
											setFiles((prev) => ({ ...prev, [selectedFile]: value }));
										}}
										onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
											// Add keyboard shortcut for execution (Cmd/Ctrl + Enter)
											if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
												event.preventDefault();
												handleExecute();
											}
										}}
									/>
								</div>
							</Tab.Panel>
							<Tab.Panel className="flex h-full flex-col items-center justify-center bg-[#111] p-4">
								<div className="mb-4 flex w-full justify-end">
									<Button variant="outline" size="sm" icon={<Maximize2 className="h-4 w-4" />}>
										Plein écran
									</Button>
								</div>
								<div className="h-[640px] w-[360px] overflow-hidden rounded-[2rem] border-8 border-gray-800 bg-black shadow-xl">
									<div className="relative h-6 bg-black">
										<div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-black" />
									</div>
									<iframe
										srcDoc={`
											<!DOCTYPE html>
											<html>
												<head>
													<meta charset="UTF-8" />
													<meta name="viewport" content="width=device-width, initial-scale=1.0" />
													<script src="https://cdn.tailwindcss.com"></script>
													<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
													<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
													<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
													<style>
														body { margin: 0; padding: 0; }
														#root { min-height: 100vh; }
													</style>
												</head>
												<body>
													<div id="root"></div>
													<script type="text/babel">
														${files['src/App.tsx']
			.replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
			.replace(/export\s+default\s+const\s+(\w+)/, 'const $1')
			.replace(/export\s+default\s+(\w+)/, 'const $1')}
														
														// Render the app
														const root = document.getElementById('root');
														ReactDOM.createRoot(root).render(React.createElement(App));
													</script>
												</body>
											</html>
										`}
										className="h-[calc(100%-2rem)] w-full bg-white"
										sandbox="allow-scripts"
										title="preview"
									/>
									<div className="flex h-2 items-center justify-center">
										<div className="h-1 w-20 rounded-full bg-gray-700" />
									</div>
								</div>
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>

			{/* Terminal */}
			<div className="h-40 border-t border-gray-800 bg-[#111]">
				<div className="flex items-center gap-2 border-b border-gray-800 bg-black/30 px-4 py-2">
					<Terminal className="h-4 w-4 text-gray-400" />
					<span className="text-sm font-medium text-gray-400">Terminal</span>
				</div>
				<div className="h-[calc(100%-40px)] space-y-1 overflow-y-auto p-4 font-mono text-sm">
					{consoleMessages.map(({ id, message }) => (
						<div key={id} className="text-gray-300">
							{message}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
