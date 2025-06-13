import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { CheckCheck, Copy } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useState } from 'react';

import { Button } from '../ui/Button';

type CodeEditorProps = {
	value: string;
	onChange: (value: string) => void;
	onExecute: () => void;
	selectedFile: string;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
	value,
	onChange,
	onExecute,
	selectedFile,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	return (
		<div className="h-full p-4">
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
			</div>
			<div className="h-[calc(100%-3rem)] overflow-hidden rounded-xl border border-gray-800">
				<CodeMirror
					value={value}
					height="100%"
					theme={oneDark}
					extensions={[javascript({ jsx: true, typescript: selectedFile.endsWith('.tsx') || selectedFile.endsWith('.ts') })]}
					onChange={onChange}
					onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
						if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
							event.preventDefault();
							onExecute();
						}
					}}
				/>
			</div>
		</div>
	);
};
