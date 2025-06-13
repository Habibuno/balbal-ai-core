import { Terminal as TerminalIcon } from 'lucide-react';
import type React from 'react';

import type { ConsoleMessage } from '../../types/editor';

type TerminalProps = {
	messages: ConsoleMessage[];
};

export const Terminal: React.FC<TerminalProps> = ({ messages }) => {
	return (
		<div className="h-40 border-t border-gray-800 bg-[#111]">
			<div className="flex items-center gap-2 border-b border-gray-800 bg-black/30 px-4 py-2">
				<TerminalIcon className="h-4 w-4 text-gray-400" />
				<span className="text-sm font-medium text-gray-400">Terminal</span>
			</div>
			<div className="h-[calc(100%-40px)] space-y-1 overflow-y-auto p-4 font-mono text-sm">
				{messages.map(({ id, message }) => (
					<div key={id} className="text-gray-300">
						{message}
					</div>
				))}
			</div>
		</div>
	);
};
