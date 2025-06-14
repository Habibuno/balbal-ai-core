import * as esbuild from 'esbuild-wasm';

let esbuildInitPromise: Promise<void> | null = null;
let isInitializing = false;

export const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export async function initializeEsbuild(): Promise<void> {
	if (esbuildInitPromise) return esbuildInitPromise;
	if (isInitializing) {
		return new Promise((resolve) => {
			const checkInterval = setInterval(() => {
				if (esbuildInitPromise) {
					clearInterval(checkInterval);
					resolve(esbuildInitPromise);
				}
			}, 100);
		});
	}

	isInitializing = true;

	try {
		esbuildInitPromise = esbuild.initialize({
			wasmURL: 'https://unpkg.com/esbuild-wasm@0.25.5/esbuild.wasm',
			worker: false,
		});

		await esbuildInitPromise;
		return esbuildInitPromise;
	} catch (error) {
		esbuildInitPromise = null;
		isInitializing = false;
		throw error;
	}
}

export function dedupeImports(code: string): string {
	const seen = new Set<string>();

	return code
		.split('\n')
		.filter((line) => {
			const match = line.match(/^import\s.+?from\s+['"](.+?)['"]/);
			if (!match) return true;
			if (seen.has(match[0])) return false;
			seen.add(match[0]);
			return true;
		})
		.join('\n');
}

export const createVirtualFilePlugin = (files: Record<string, string>) => ({
	name: 'virtual-fs',
	setup(build: esbuild.PluginBuild) {
		build.onResolve({ filter: /.*/ }, (args) => {
			if (
				args.path.startsWith('./') ||
				args.path.startsWith('../') ||
				args.path.startsWith('src/')
			) {
				let resolvedPath = new URL(args.path, `file://${args.resolveDir}/`).pathname.slice(1);

				if (!/\.\w+$/.test(resolvedPath)) {
					if (files[`${resolvedPath}.tsx`]) resolvedPath += '.tsx';
					else if (files[`${resolvedPath}.ts`]) resolvedPath += '.ts';
					else if (files[`${resolvedPath}.js`]) resolvedPath += '.js';
					else if (files[`${resolvedPath}.jsx`]) resolvedPath += '.jsx';
				}

				return { path: resolvedPath, namespace: 'virtual' };
			}

			// Externals (libs tierces)
			return { path: args.path, external: true };
		});

		build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
			const path = args.path.startsWith('src/') ? args.path : `src/${args.path}`;
			const fileContent = files[path];
			if (!fileContent) return;

			return {
				contents: fileContent,
				loader: path.endsWith('.ts') || path.endsWith('.tsx') ? 'tsx' : 'js',
			};
		});
	},
}); 