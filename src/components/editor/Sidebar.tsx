import { FolderTree, Loader2, Wand2 } from 'lucide-react';

import { Button } from '../ui/Button';
import type { EditorState } from '../../types/editor';

type SidebarProps = {
	state: EditorState;
	onFileSelect: (path: string) => void;
	onPromptChange: (prompt: string) => void;
	onGenerate: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
	state,
	onFileSelect,
	onPromptChange,
	onGenerate,
}) => {
	return (
		<div className="w-full overflow-y-auto border-r border-gray-800 bg-[#1f1f1f] p-4 lg:w-64 lg:min-w-64">
			<h2 className="mb-4 text-sm font-semibold text-gray-400">FILES</h2>
			<div className="space-y-2">
				{Object.keys(state.files).map((path) => (
					<Button
						key={path}
						onClick={() => onFileSelect(path)}
						className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
							state.selectedFile === path
								? 'bg-gray-800 text-white'
								: 'text-gray-400 hover:bg-gray-800/50'
						}`}
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
						value={state.prompt}
						onChange={(e) => onPromptChange(e.target.value)}
						placeholder="Décris ton idée d'application..."
						className="h-32 w-full resize-none rounded-xl border border-gray-800 bg-[#111] p-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
					/>
					<Button
						onClick={onGenerate}
						disabled={!state.prompt.trim() || state.isGenerating}
						className="w-full"
						icon={
							state.isGenerating ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Wand2 className="h-4 w-4" />
							)
						}
					>
						{state.isGenerating ? 'Génération...' : 'Générer avec l\'IA'}
					</Button>
				</div>
			</div>
		</div>
	);
};