import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>BalBal.io Preview</title>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@18.2.0",
          "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
        }
      }
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import React from 'react';
      import { createRoot } from 'react-dom/client';

      // Component declarations will be injected here
      __COMPONENTS__

      // Render App component
      const root = createRoot(document.getElementById('root'));
      root.render(React.createElement(React.StrictMode, null,
        React.createElement(App)
      ));
    </script>
  </body>
</html>`;

type ProcessedFile = {
	name: string;
	code: string;
	dependencies: string[];
};

/**
 * Processes a single TypeScript/React file to:
 * 1. Remove imports/exports
 * 2. Extract component dependencies
 * 3. Clean up the code
 */
function processFile(path: string, content: string): ProcessedFile {
	const dependencies: string[] = [];
	let code = content;

	try {
		const ast = parse(content, {
			sourceType: 'module',
			plugins: ['jsx', 'typescript'],
		});

		// Remove imports and collect dependencies
		traverse(ast, {
			ImportDeclaration(path) {
				const source = path.node.source.value;
				if (!source.startsWith('.')) {
					// Keep track of external dependencies
					path.node.specifiers.forEach((specifier) => {
						if (t.isImportSpecifier(specifier) || t.isImportDefaultSpecifier(specifier)) {
							dependencies.push(specifier.local.name);
						}
					});
				}
				path.remove();
			},
			ExportDefaultDeclaration(path) {
				// Replace 'export default' with direct assignment
				const declaration = path.node.declaration;
				if (t.isFunctionDeclaration(declaration) && declaration.id) {
					path.replaceWith(declaration);
				} else {
					path.remove();
				}
			},
			ExportNamedDeclaration(path) {
				// Replace named exports with their declarations
				const declaration = path.node.declaration;
				if (declaration) {
					path.replaceWith(declaration);
				} else {
					path.remove();
				}
			},
		});

		// Generate cleaned code
		code = generate(ast).code;
	} catch (error) {
		console.error(`Error processing file ${path}:`, error);
		// Return original code if parsing fails
		return {
			name: path,
			code: content,
			dependencies: [],
		};
	}

	return {
		name: path,
		code,
		dependencies,
	};
}

/**
 * Sorts files to ensure dependencies are declared before they're used
 */
function sortFiles(files: ProcessedFile[]): ProcessedFile[] {
	const componentNames = files.map((f) => {
		const name =
			f.name
				.split('/')
				.pop()
				?.replace(/\.tsx?$/, '') || '';
		return name;
	});

	return files.sort((a, b) => {
		// App.tsx should always be last
		if (a.name.includes('App.tsx')) return 1;
		if (b.name.includes('App.tsx')) return -1;

		// Sort by dependency count
		return (
			a.dependencies.filter((d) => componentNames.includes(d)).length -
			b.dependencies.filter((d) => componentNames.includes(d)).length
		);
	});
}

/**
 * Builds a complete HTML document with all React components properly concatenated
 */
export function buildReactIframeFromFiles(files: Record<string, string>): string {
	// Ensure we have at least one file
	if (!Object.keys(files).length) {
		throw new Error('No files provided');
	}

	// Process all files
	const processedFiles = Object.entries(files).map(([path, content]) => processFile(path, content));

	// Sort files based on dependencies
	const sortedFiles = sortFiles(processedFiles);

	// Concatenate all component code
	const componentsCode = sortedFiles.map((file) => file.code.trim()).join('\n\n');

	// If App.tsx is missing, create a default App component
	const hasAppComponent = Object.keys(files).some((path) => path.endsWith('App.tsx'));
	const finalComponentsCode = hasAppComponent
		? componentsCode
		: `
    ${componentsCode}

    function App() {
      return React.createElement('div', null, 'No App component found');
    }
  `;

	// Insert components into HTML template
	return HTML_TEMPLATE.replace('__COMPONENTS__', finalComponentsCode);
}
