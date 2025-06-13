export type ConsoleMessage = {
	id: string;
	message: string;
};

export type EditorState = {
	previewHtml: string;
	selectedFile: string;
	files: Record<string, string>;
	isGenerating: boolean;
	consoleMessages: ConsoleMessage[];
	prompt: string;
	esbuildReady: boolean;
};
