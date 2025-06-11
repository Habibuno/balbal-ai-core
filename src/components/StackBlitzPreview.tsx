import sdk from '@stackblitz/sdk';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { Button } from './ui/Button';

type Props = {
	files?: Record<string, string>;
};

const DEFAULT_FILES = {
	'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BalBal.io Preview</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
	'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
	'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
	'package.json': `{
  "name": "balbal-preview",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18"
  }
}`,
};

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export const StackBlitzPreview: React.FC<Props> = ({ files = {} }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [, setRetryCount] = React.useState(0);

	const initializePreview = async (retryAttempt = 0) => {
		if (!containerRef.current) {
			if (retryAttempt < MAX_RETRIES) {
				setTimeout(
					() => {
						initializePreview(retryAttempt + 1);
					},
					INITIAL_RETRY_DELAY * 2 ** retryAttempt
				);
				return;
			}
			setError('Container not available');
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const projectFiles = {
				...DEFAULT_FILES,
				...files,
			};

			requestAnimationFrame(async () => {
				try {
					const container = containerRef.current;
					if (!container) {
						throw new Error('Container not available');
					}
					await sdk.embedProject(
						container,
						{
							title: 'BalBal.io Preview',
							description: 'Preview of your mobile application',
							template: 'create-react-app',
							files: projectFiles,
							settings: {
								compile: {
									clearConsole: true,
								},
							},
						},
						{
							clickToLoad: false,
							height: 600,
							hideDevTools: true,
							hideExplorer: true,
							hideNavigation: true,
							terminalHeight: 0,
						}
					);
					setIsLoading(false);
					setRetryCount(0);
				} catch (embedError) {
					console.error('Failed to embed StackBlitz project:', embedError);
					if (retryAttempt < MAX_RETRIES) {
						setTimeout(
							() => {
								initializePreview(retryAttempt + 1);
							},
							INITIAL_RETRY_DELAY * 2 ** retryAttempt
						);
					} else {
						setError('Failed to load preview');
						setIsLoading(false);
						setRetryCount(retryAttempt);
					}
				}
			});
		} catch (error) {
			console.error('Failed to initialize StackBlitz preview:', error);

			if (retryAttempt < MAX_RETRIES) {
				setTimeout(
					() => {
						initializePreview(retryAttempt + 1);
					},
					INITIAL_RETRY_DELAY * 2 ** retryAttempt
				);
			} else {
				setError('Failed to load preview');
				setIsLoading(false);
				setRetryCount(retryAttempt);
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			initializePreview();
		}, 100);

		return () => clearTimeout(timeoutId);
	}, [files]);

	const handleRetry = () => {
		setRetryCount(0);
		initializePreview();
	};

	return (
		<div className="relative mx-auto">
			{/* Phone frame */}
			<div className="mx-auto max-w-sm overflow-hidden rounded-[2.5rem] border-8 border-gray-800 bg-black shadow-xl">
				{/* Notch */}
				<div className="relative">
					<div className="absolute inset-x-0 top-0 h-6 rounded-b-3xl bg-black" />
				</div>

				{/* Content container */}
				<div ref={containerRef} className="h-[600px] w-full overflow-hidden bg-white">
					{/* Loading state */}
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center bg-gray-900">
							<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
						</div>
					)}

					{/* Error state */}
					{error && (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900 p-4">
							<div className="flex items-center">
								<AlertTriangle className="h-8 w-8 text-amber-500" />
								<p className="ml-2 text-gray-400">{error}</p>
							</div>
							<Button
								onClick={handleRetry}
								className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
							>
								<RefreshCw className="h-4 w-4" />
								Retry
							</Button>
						</div>
					)}
				</div>

				{/* Home indicator */}
				<div className="mx-auto my-2 h-1 w-20 rounded-full bg-gray-700" />
			</div>
		</div>
	);
};
