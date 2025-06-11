import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export const CodeEditor: React.FC<Props> = ({ value, onChange }) => {
	return (
		<CodeMirror
			value={value}
			height="100%"
			theme={oneDark}
			extensions={[javascript({ jsx: true })]}
			onChange={onChange}
			basicSetup={{
				lineNumbers: true,
				highlightActiveLineGutter: true,
				highlightSpecialChars: true,
				history: true,
				foldGutter: true,
				drawSelection: true,
				dropCursor: true,
				allowMultipleSelections: true,
				indentOnInput: true,
				syntaxHighlighting: true,
				bracketMatching: true,
				closeBrackets: true,
				autocompletion: true,
				rectangularSelection: true,
				crosshairCursor: true,
				highlightActiveLine: true,
				highlightSelectionMatches: true,
				closeBracketsKeymap: true,
				defaultKeymap: true,
				searchKeymap: true,
				historyKeymap: true,
				foldKeymap: true,
				completionKeymap: true,
				lintKeymap: true,
			}}
		/>
	);
};
