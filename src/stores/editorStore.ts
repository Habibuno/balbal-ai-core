import { create } from 'zustand';

type EditorState = {
	selectedFile: string;
	files: Record<string, string>;
	isGenerating: boolean;
	consoleMessages: string[];
	setSelectedFile: (file: string) => void;
	updateFile: (path: string, content: string) => void;
	addConsoleMessage: (message: string) => void;
	executeCode: () => void;
};

const DEFAULT_CODE = `export default function App() {
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
}`;

export const useEditorStore = create<EditorState>((set, get) => ({
	selectedFile: 'src/App.tsx',
	files: {
		'src/App.tsx': DEFAULT_CODE,
	},
	isGenerating: false,
	consoleMessages: [
		'🚀 Initializing development environment...',
		'✨ Dependencies installed successfully',
		'🔧 Preview ready',
	],
	setSelectedFile: (file) => set({ selectedFile: file }),
	updateFile: (path, content) =>
		set((state) => ({
			files: { ...state.files, [path]: content },
		})),
	addConsoleMessage: (message) =>
		set((state) => ({
			consoleMessages: [...state.consoleMessages, message],
		})),
	executeCode: () => {
		const state = get();
		state.addConsoleMessage('🔄 Executing code...');
		// Add execution logic here
	},
}));
