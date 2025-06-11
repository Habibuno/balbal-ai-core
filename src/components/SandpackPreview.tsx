import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';
import { AlertTriangle } from 'lucide-react';
import type React from 'react';

type Props = {
	files: Record<string, string>;
};

const defaultFiles = {
	'/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
};

export const SandpackPreviewCustom: React.FC<Props> = ({ files }) => {
	if (!files || !files['App.tsx']) {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-gray-50 p-6">
				<AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
				<h3 className="mb-2 text-lg font-semibold text-gray-800">
					Impossible d'afficher cette app
				</h3>
				<p className="text-center text-gray-600">Le fichier App.tsx est manquant ou invalide.</p>
			</div>
		);
	}

	const sandpackFiles = {
		...defaultFiles,
		'/App.tsx': files['App.tsx'],
		'/index.tsx': `
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
	};

	return (
		<SandpackProvider
			template="react-ts"
			theme={nightOwl}
			files={sandpackFiles}
			customSetup={{
				dependencies: {
					'react': '^18.0.0',
					'react-dom': '^18.0.0',
					'@headlessui/react': '^1.7.18',
					'lucide-react': '^0.344.0',
					'clsx': '^2.1.0',
				},
			}}
			options={{
				externalResources: ['https://cdn.tailwindcss.com'],
				recompileMode: 'immediate',
				recompileDelay: 300,
				bundlerURL: 'https://sandpack-bundler.pages.dev',
				// showNavigator: false,
				// showTabs: false,
				// showLineNumbers: true,
				// showInlineErrors: true,
				// closableTabs: false,
				initMode: 'immediate',
			}}
		>
			<div className="h-full w-full">
				<SandpackPreview showNavigator={false} showRefreshButton showOpenInCodeSandbox={false} />
			</div>
		</SandpackProvider>
	);
};
