import { Loader2, Wand2 } from 'lucide-react';
import React, { useState } from 'react';

import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../ui/Button';

export const AIAssistant: React.FC = () => {
	const [prompt, setPrompt] = useState('');
	const { isGenerating, addConsoleMessage } = useEditorStore();

	const handleGenerate = async () => {
		if (!prompt.trim() || isGenerating) return;

		addConsoleMessage('🤖 Generating code with AI...');
		// AI generation logic will be implemented here
		setPrompt('');
	};

	return (
		<div className="flex flex-1 flex-col p-2">
			<div className="mb-4 flex-1 overflow-y-auto">
				{/* Chat history will be implemented here */}
			</div>

			<div className="space-y-2">
				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="Describe your app idea..."
					className="h-32 w-full resize-none rounded border border-gray-700 bg-[#1E1E1E] p-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
				/>
				<Button
					onClick={handleGenerate}
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
					{isGenerating ? 'Generating...' : 'Generate with AI'}
				</Button>
			</div>
		</div>
	);
};
