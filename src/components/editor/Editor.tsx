import { Tab } from '@headlessui/react';
import { clsx } from 'clsx';
import {
	Apple,
	ArrowLeft,
	ChevronDown,
	ChevronRight,
	Code2,
	Eye,
	Files,
	MessageSquare,
	Play,
	Settings,
	Store,
	Terminal,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../ui/Button';
import { AIAssistant } from './AIAssistant';
import { CodeEditor } from './CodeEditor';
import { FileTree } from './FileTree';
import { Terminal as TerminalComponent } from './Terminal';

export const Editor: React.FC = () => {
	const navigate = useNavigate();
	const [showAIPanel, setShowAIPanel] = useState(true);
	const [showFileTree, setShowFileTree] = useState(true);
	const [showTerminal, setShowTerminal] = useState(true);

	const { selectedFile, files, consoleMessages, updateFile, executeCode } = useEditorStore();

	const defaultPreview = `
    <div style="
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom, #1f1f1f, #111);
      color: rgba(255, 255, 255, 0.7);
      font-family: Inter, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: -0.01em;
      text-align: center;
      padding: 20px;
    ">
      Powered by BalBal.io
    </div>
  `;

	return (
		<div className="flex min-h-screen flex-col overflow-hidden bg-[#1E1E1E]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-[#404040] bg-[#2D2D2D] p-4">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						onClick={() => navigate('/')}
						icon={<ArrowLeft className="h-5 w-5" />}
						size="sm"
					>
						Back
					</Button>
					<h1 className="font-mono text-xl text-gray-200">BalBal.io Editor</h1>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => executeCode()}
						icon={<Play className="h-4 w-4" />}
					>
						Run
					</Button>
					<Button variant="outline" size="sm" icon={<Settings className="h-4 w-4" />}>
						Settings
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1">
				{/* Left Sidebar */}
				<div
					className={clsx(
						'flex flex-col border-r border-[#404040] transition-all duration-300',
						showAIPanel ? 'w-80' : 'w-0'
					)}
				>
					{showAIPanel && (
						<>
							<div className="flex items-center justify-between border-b border-[#404040] p-2">
								<div className="flex items-center gap-2">
									<MessageSquare className="h-4 w-4 text-cyan-400" />
									<span className="text-sm font-medium text-gray-300">AI Assistant</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowAIPanel(false)}
									icon={<ChevronRight className="h-4 w-4" />}
								/>
							</div>
							<AIAssistant />
						</>
					)}
				</div>

				{/* File Tree */}
				<div
					className={clsx(
						'flex flex-col border-r border-[#404040] transition-all duration-300',
						showFileTree ? 'w-64' : 'w-0'
					)}
				>
					{showFileTree && (
						<>
							<div className="flex items-center justify-between border-b border-[#404040] p-2">
								<div className="flex items-center gap-2">
									<Files className="h-4 w-4 text-cyan-400" />
									<span className="text-sm font-medium text-gray-300">Files</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowFileTree(false)}
									icon={<ChevronRight className="h-4 w-4" />}
								/>
							</div>
							<FileTree />
						</>
					)}
				</div>

				{/* Editor and Preview */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<Tab.Group>
						<Tab.List className="flex border-b border-[#404040] bg-[#2D2D2D]">
							<Tab
								className={({ selected }) =>
									clsx(
										'px-4 py-2 font-mono text-sm focus:outline-none',
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
										'px-4 py-2 font-mono text-sm focus:outline-none',
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
							<Tab.Panel className="h-full">
								<CodeEditor
									value={files[selectedFile]}
									onChange={(code) => updateFile(selectedFile, code)}
								/>
							</Tab.Panel>
							<Tab.Panel className="flex h-full items-center justify-center bg-[#1E1E1E] p-4">
								<div className="flex items-center gap-12">
									{/* Phone Preview */}
									<div className="relative h-[640px] w-[320px] overflow-hidden rounded-[40px] border-8 border-gray-800 bg-black shadow-2xl">
										<div className="absolute left-1/2 top-0 z-20 flex h-6 w-32 -translate-x-1/2 transform items-center justify-center rounded-b-2xl bg-black">
											<div className="h-3 w-16 rounded-full bg-gray-900" />
										</div>

										<div className="h-full w-full overflow-hidden bg-gradient-to-b from-[#1f1f1f] to-[#111]">
											<iframe
												srcDoc={
													files[selectedFile]
														? `
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <meta charset="UTF-8" />
                              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                              <script src="https://cdn.tailwindcss.com"></script>
                              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                            </head>
                            <body style="margin:0">
                              <div id="root"></div>
                              <script type="text/babel">
                                ${files[selectedFile]}
                                
                                const root = ReactDOM.createRoot(document.getElementById('root'));
                                root.render(React.createElement(React.StrictMode, null,
                                  React.createElement(App)
                                ));
                              </script>
                            </body>
                          </html>
                        `
														: defaultPreview
												}
												className="h-full w-full"
												sandbox="allow-scripts"
												title="preview"
											/>
										</div>

										<div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gray-700" />
									</div>

									{/* Store Buttons */}
									<div className="flex flex-col gap-6">
										<Button
											variant="outline"
											size="lg"
											className="h-16 w-56 border-gray-700 bg-black hover:bg-gray-900"
										>
											<div className="flex items-center gap-3">
												<Apple className="h-8 w-8" />
												<div className="flex flex-col items-start">
													<span className="text-xs opacity-70">Download on the</span>
													<span className="-mt-1 text-lg font-semibold">App Store</span>
												</div>
											</div>
										</Button>

										<Button
											variant="outline"
											size="lg"
											className="h-16 w-56 border-gray-700 bg-black hover:bg-gray-900"
										>
											<div className="flex items-center gap-3">
												<Store className="h-8 w-8" />
												<div className="flex flex-col items-start">
													<span className="text-xs opacity-70">GET IT ON</span>
													<span className="-mt-1 text-lg font-semibold">Play Store</span>
												</div>
											</div>
										</Button>
									</div>
								</div>
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>

			{/* Terminal */}
			<div
				className={clsx(
					'border-t border-[#404040] bg-[#1E1E1E] transition-all duration-300',
					showTerminal ? 'h-40' : 'h-0'
				)}
			>
				{showTerminal && (
					<>
						<div className="flex items-center justify-between border-b border-[#404040] bg-[#2D2D2D] p-2">
							<div className="flex items-center gap-2">
								<Terminal className="h-4 w-4 text-gray-400" />
								<span className="font-mono text-sm text-gray-400">Terminal</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowTerminal(false)}
								icon={<ChevronDown className="h-4 w-4" />}
							/>
						</div>
						<TerminalComponent messages={consoleMessages} />
					</>
				)}
			</div>
		</div>
	);
};
