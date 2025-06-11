import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';

function SandpackTest() {
	if (typeof window === 'undefined') {
		return null;
	}

	const files = {
		'/App.tsx': `
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hello Sandpack!</h1>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>
    </div>
  );
}`,
		'/index.html': `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sandpack Test</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
	};

	return (
		<div className="min-h-screen bg-gray-900 p-8">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-4 text-2xl text-white">Sandpack Test Environment</h1>
				<div className="overflow-hidden rounded-lg border border-gray-700">
					<SandpackProvider
						theme={nightOwl}
						template="react-ts"
						files={files}
						customSetup={{
							dependencies: {
								'react': '^18.0.0',
								'react-dom': '^18.0.0',
							},
						}}
						options={{
							externalResources: ['https://cdn.tailwindcss.com'],
							recompileMode: 'immediate',
							bundlerURL: 'https://sandpack-bundler.pages.dev',
						}}
					>
						<SandpackPreview
							showNavigator={false}
							showRefreshButton
							showOpenInCodeSandbox={false}
						/>
					</SandpackProvider>
				</div>
			</div>
		</div>
	);
}

export default SandpackTest;
