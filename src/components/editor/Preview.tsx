import React from 'react';
import ReactDOM from 'react-dom/client';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as RNW from 'react-native-web';

type PreviewProps = {
	files: Record<string, string>;
};

export function Preview({ files }: PreviewProps) {
	function render(el: React.ReactElement) {
		const mount = document.createElement('div');
		ReactDOM.createRoot(mount).render(el);
		return mount;
	}

	const combinedCode = Object.values(files)
		.map(code =>
			code
				.replace(/^import\s.+?;$/gm, '')
				.replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
				.replace(/^export\s+(const|let|var|function|class)\s+/gm, '$1 ')
				.replace(/^export\s*\{[^}]+\}\s*;$/gm, '')
		)
		.join('\n');

	const scope: any = {
		React,
		ReactDOM,
		...RNW,
		ReactNavigationNative: (window as any).ReactNavigationNative,
		ReactNavigationNativeStack: (window as any).ReactNavigationNativeStack,
		ReactNavigationBottomTabs: (window as any).ReactNavigationBottomTabs,
		render,
		module: { exports: {} },
		exports: {},
	};

	let cleaned = combinedCode;
	cleaned = cleaned
		.replace(/require\(['"]react['"]\)/g, 'React')
		.replace(/require\(['"]react-dom['"]\)/g, 'ReactDOM')
		.replace(/require\(['"]react-native-web['"]\)/g, 'ReactNativeWeb')
		.replace(/require\(['"]@react-navigation\/native['"]\)/g, 'ReactNavigationNative')
		.replace(/require\(['"]@react-navigation\/native-stack['"]\)/g, 'ReactNavigationNativeStack')
		.replace(/require\(['"]@react-navigation\/bottom-tabs['"]\)/g, 'ReactNavigationBottomTabs');

	return (
		<LiveProvider
			code={cleaned}
			scope={scope}
			noInline
			transformCode={code => `
        ${code}
        render(React.createElement(App));
      `}
		>
			<LiveError style={{ color: 'salmon' }} />
			<LivePreview
				style={{
					border: '1px solid #444',
					padding: '1rem',
					borderRadius: '4px',
					background: '#111',
					minHeight: 400,
				}}
			/>
		</LiveProvider>
	);
}
