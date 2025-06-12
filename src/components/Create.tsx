import { Tab } from '@headlessui/react';
import { ArrowLeft, Code2, Eye, Play, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CodeEditor } from './editor/CodeEditor';
import { Preview } from './editor/Preview';
import { Sidebar } from './editor/Sidebar';
import { Terminal } from './editor/Terminal';
import { useEditor } from './editor/useEditor';
import { Button } from './ui/Button';

// Helper to generate unique IDs
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const Create: React.FC = () => {
	const navigate = useNavigate();
	const { state, setState, compileProject, handleGenerateWithAI } = useEditor();
	const [tabIndex, setTabIndex] = useState(0);

	const handleExecute = async () => {
		console.log('🔍 State :', state);

		try {
			setState(prev => ({
				...prev,
				consoleMessages: [
					...prev.consoleMessages,
					{ id: generateUniqueId(), message: '🔄 Compiling project...' },
				],
			}));

			const entry = state.selectedFile;
			const result = await compileProject(entry, state.files);
			let jsBundle = result.outputFiles[0].text;
			jsBundle = jsBundle
				.replace(/^import\s+React.+$/gm, '')
				.replace(/^import\s+\*\s+as\s+jsxRuntime.+$/gm, '')
				.replace(/^import\s+ReactDOM.+$/gm, '')
				.replace(
					/^import\s+\S.*(?:[\n\r\u2028\u2029]\s*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF])from\s+['"]react\/jsx-runtime['"].*$/gm,
					''
				);
			jsBundle = jsBundle.replace(
				/^import\s+\{[^}]+\}\s+from\s+['"]react-native-web['"];?$/gm,
				''
			);
			console.log('imports RNW dans bundle ?', jsBundle.includes('react-native-web'));

			const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>html, body, #root_preview { margin:0; padding:0; height:100%; }</style>
  </head>
  <body>
    <div id="root_preview"></div>
    <script type="module">
			import React from 'https://esm.sh/react@18.2.0';
			import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
			import * as RNW from 'https://esm.sh/react-native-web@0.18.10';
			const { View, Text, StyleSheet } = RNW;


      ${jsBundle}

      const root = ReactDOM.createRoot(document.getElementById('root_preview'));
      root.render(React.createElement(App));
    </script>
  </body>
</html>
`;

			const previewFrame = document.querySelector('iframe[title="preview"]') as HTMLIFrameElement;
			if (previewFrame) previewFrame.srcdoc = html;

			setTabIndex(1);
			setState(prev => ({
				...prev,
				previewHtml: html,
				consoleMessages: [...prev.consoleMessages, {
					id: generateUniqueId(),
					message: '✅ Project compiled and preview ready',
				}],
			}));
		} catch (err) {
			console.error('Compilation error:', err);
			setState(prev => ({
				...prev,
				consoleMessages: [
					...prev.consoleMessages,
					{
						id: generateUniqueId(),
						message: `❌ Compilation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
					},
				],
			}));
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
			</div>

			{/* Main Content */}
			<div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
				{/* Sidebar */}
				<Sidebar
					state={state}
					onFileSelect={(path) => setState(prev => ({ ...prev, selectedFile: path }))}
					onPromptChange={(prompt) => setState(prev => ({ ...prev, prompt }))}
					onGenerate={handleGenerateWithAI}
				/>

				{/* Editor and Preview */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
						<Tab.List className="flex border-b border-gray-800 bg-black/30">
							<Tab
								className={({ selected }) =>
									`px-4 py-2 text-sm font-medium focus:outline-none ${
										selected
											? 'border-b-2 border-cyan-400 text-white'
											: 'text-gray-400 hover:text-gray-300'
									}`}
							>
								<div className="flex items-center gap-2">
									<Code2 className="h-4 w-4" />
									Code
								</div>
							</Tab>
							<Tab
								className={({ selected }) =>
									`px-4 py-2 text-sm font-medium focus:outline-none ${
										selected
											? 'border-b-2 border-cyan-400 text-white'
											: 'text-gray-400 hover:text-gray-300'
									}`}
							>
								<div className="flex items-center gap-2">
									<Eye className="h-4 w-4" />
									Preview
								</div>
							</Tab>
						</Tab.List>

						<Tab.Panels className="flex-1">
							<Tab.Panel className="h-full">
								<CodeEditor
									value={state.files[state.selectedFile]}
									onChange={(value) =>
										setState(prev => ({
											...prev,
											files: { ...prev.files, [prev.selectedFile]: value },
										}))}
									onExecute={handleExecute}
									selectedFile={state.selectedFile}
								/>
							</Tab.Panel>
							<Tab.Panel className="h-full">
								<Preview previewHtml={state.previewHtml} />
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>

			{/* Terminal */}
			<Terminal messages={state.consoleMessages} />
		</div>
	);
};