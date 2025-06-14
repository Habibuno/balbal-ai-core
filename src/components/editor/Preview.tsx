import React from 'react';
import ReactDOM from 'react-dom/client';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as RNW from 'react-native-web';

import { sendErrorReport } from '../../api/reporting';
import { reportError } from '../../utils/reporting';

type PreviewProps = {
	files: Record<string, string>;
};

type ReactComponentProps = {
	children?: React.ReactNode;
	[key: string]: unknown;
};

type ReactNavigationType = {
	NavigationContainer: React.ComponentType<ReactComponentProps>;
	createNativeStackNavigator: () => {
		Navigator: React.ComponentType<ReactComponentProps>;
		Screen: React.ComponentType<ReactComponentProps>;
	};
};

type ReactNavigationBottomTabsType = {
	createBottomTabNavigator: () => {
		Navigator: React.ComponentType<ReactComponentProps>;
		Screen: React.ComponentType<ReactComponentProps>;
	};
};

type PreviewScope = {
	React: typeof React;
	ReactDOM: typeof ReactDOM;
	ReactNavigationNative: ReactNavigationType;
	ReactNavigationNativeStack: ReactNavigationType;
	ReactNavigationBottomTabs: ReactNavigationBottomTabsType;
	render: (el: React.ReactElement) => HTMLElement;
	module: { exports: Record<string, unknown> };
	exports: Record<string, unknown>;
	useState: typeof React.useState;
	useEffect: typeof React.useEffect;
	useRef: typeof React.useRef;
	useCallback: typeof React.useCallback;
	useMemo: typeof React.useMemo;
	useContext: typeof React.useContext;
} & typeof RNW;

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

	const scope: PreviewScope = {
		React,
		ReactDOM,
		...RNW,
		useState: React.useState,
		useEffect: React.useEffect,
		useRef: React.useRef,
		useCallback: React.useCallback,
		useMemo: React.useMemo,
		useContext: React.useContext,
		ReactNavigationNative: (window as unknown as { ReactNavigationNative: ReactNavigationType }).ReactNavigationNative,
		ReactNavigationNativeStack: (window as unknown as { ReactNavigationNativeStack: ReactNavigationType }).ReactNavigationNativeStack,
		ReactNavigationBottomTabs: (window as unknown as { ReactNavigationBottomTabs: ReactNavigationBottomTabsType }).ReactNavigationBottomTabs,
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
		.replace(/require\(['"]@react-navigation\/bottom-tabs['"]\)/g, 'ReactNavigationBottomTabs')
		.replace(/require\(['"]@react-native-community\/hooks['"]\)/g, '{ useDimensions }');

	return (
		<LiveProvider
			code={cleaned}
			scope={scope}
			noInline
			transformCode={code => `
        // Wrap the code in a function to avoid variable hoisting issues
        (function() {
          try {
            const baseStyles = {
              container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                backgroundColor: '#fff',
              },
              text: {
                fontSize: 16,
                color: '#000',
              },
              button: {
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 8,
                marginTop: 16,
              },
              buttonText: {
                color: '#fff',
                fontSize: 16,
                textAlign: 'center',
              },
            };

            // Create a global styles object that can be used by the app
            window.appStyles = baseStyles;

            ${code}

            // If the app doesn't define its own styles, use the base styles
            if (typeof styles === 'undefined') {
              const styles = window.appStyles;
            }

            render(React.createElement(App));
          } catch (error) {
            // Report the error
            sendErrorReport({
              error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
              },
              context: {
                component: 'Preview',
                action: 'Code Execution',
                additionalData: {
                  files: Object.keys(files),
                  selectedFile: files[Object.keys(files)[0]],
                },
              },
            });
            throw error;
          }
        })();
      `}
		>
			<LiveError
				style={{ color: 'salmon' }}
				onError={(error: Error) => {
					sendErrorReport({
						error: {
							name: error.name,
							message: error.message,
							stack: error.stack,
						},
						context: {
							component: 'Preview',
							action: 'LiveError',
							additionalData: {
								files: Object.keys(files),
								selectedFile: files[Object.keys(files)[0]],
							},
						},
					});
				}}
			/>
			<div className="relative mx-auto w-[375px] rounded-[60px] shadow-xl">
				{/* Notch */}
				<div className="absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-gray-800" />
				{/* Screen */}
				<div className="overflow-hidden rounded-[40px] bg-white m-4">
					<LivePreview
						style={{
							background: '#fff',
							minHeight: 600,
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					/>
				</div>
			</div>
		</LiveProvider>
	);
}
