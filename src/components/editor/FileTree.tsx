import { clsx } from 'clsx';
import { FolderTree } from 'lucide-react';
import type React from 'react';

import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../ui/Button';

export const FileTree: React.FC = () => {
	const { selectedFile, files, setSelectedFile } = useEditorStore();

	return (
		<div className="flex-1 overflow-y-auto p-2">
			<div className="space-y-1">
				{Object.keys(files).map((path) => (
					<Button
						key={path}
						onClick={() => setSelectedFile(path)}
						className={clsx(
							'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors',
							selectedFile === path
								? 'bg-[#37373D] text-white'
								: 'text-gray-400 hover:bg-[#2A2A2A]'
						)}
					>
						<FolderTree className="h-4 w-4 flex-shrink-0" />
						<span className="truncate text-left">{path}</span>
					</Button>
				))}
			</div>
		</div>
	);
};
