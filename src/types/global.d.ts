declare global {
	// eslint-disable-next-line ts/consistent-type-definitions
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		prettier: typeof import('prettier/standalone');
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		prettierPlugins: any[];
	}
}

export {};
