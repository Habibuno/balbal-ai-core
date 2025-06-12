import { Tab } from '@headlessui/react';
import { ArrowLeft, Code2, Eye, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CodeEditor } from './editor/CodeEditor';
import { Preview } from './editor/Preview';
import { Sidebar } from './editor/Sidebar';
import { Terminal } from './editor/Terminal';
import { useEditor } from './editor/useEditor';
import { Button } from './ui/Button';

export const Create: React.FC = () => {
	const navigate = useNavigate();
	const { state, setState, compileProject, handleGenerateWithAI } = useEditor();

	const handleExecute = async () => {
		try {
			const entry = state.selectedFile;
			const jsBundle = await compileProject(entry, state.files);

			const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/react-native-web/dist/index.umd.js"></script>
  <style>html, body, #root { margin: 0; height: 100%; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    const { View, Text, TouchableOpacity, StyleSheet } = window['react-native-web'];

    ${jsBundle}

    const root = document.getElementById('root');
    ReactDOM.createRoot(root).render(React.createElement(App));
  </script>
</body>
</html>`;

			setState(prev => ({
				...prev,
				consoleMessages: [...prev.consoleMessages, {
					id: `preview-${Date.now()}`,
					message: '✅ Project compiled and preview injected',
				}],
			}));
		} catch (err) {
			setState(prev => ({
				...prev,
				consoleMessages: [...prev.consoleMessages, {
					id: `err-${Date.now()}`,
					message: `❌ Compilation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
				}],
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
				<Button variant="outline" size="sm" icon={<Settings className="h-4 w-4" />}>
					Settings
				</Button>
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
					<Tab.Group>
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
								<Preview files={state.files} />
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