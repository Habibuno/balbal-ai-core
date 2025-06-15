import type { ComponentType, ReactElement } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as RNW from 'react-native-web';

import { sendErrorReport } from '../../api/reporting';

type PreviewProps = {
	files: Record<string, string>;
};

type ReactComponentProps = {
	children?: React.ReactNode;
	[key: string]: unknown;
};

type NavigatorProps = {
	children?: React.ReactNode;
	[key: string]: unknown;
};

type ScreenProps = {
	component: ComponentType<Record<string, unknown>>;
	name: string;
	[key: string]: unknown;
};

type NavigationProps = {
	navigation: {
		navigate: (screenName: string, params?: Record<string, unknown>) => void;
		goBack: () => void;
	};
	route: {
		params: Record<string, unknown>;
	};
};

type ReactNavigationType = {
	NavigationContainer: ComponentType<NavigatorProps>;
	createNativeStackNavigator: () => {
		Navigator: ComponentType<NavigatorProps>;
		Screen: ComponentType<ScreenProps>;
	};
};

type ReactNavigationBottomTabsType = {
	createBottomTabNavigator: () => {
		Navigator: ComponentType<NavigatorProps>;
		Screen: ComponentType<ScreenProps>;
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
	sendErrorReport: typeof sendErrorReport;
	files: Record<string, string>;
} & typeof RNW;

// Create a navigation context
const NavigationContext = React.createContext<{
	navigation: {
		navigate: (screenName: string, params?: Record<string, unknown>) => void;
		goBack: () => void;
	};
	route: {
		params: Record<string, unknown>;
	};
} | null>(null);

function NavigationProvider({ children }: { children: React.ReactNode }) {
	const [currentScreen, setCurrentScreen] = React.useState('Home');
	const [screenParams, setScreenParams] = React.useState<Record<string, unknown>>({});
	const [screenHistory, setScreenHistory] = React.useState<string[]>(['Home']);

	const navigation = {
		navigate: (screenName: string, params?: Record<string, unknown>) => {
			console.log('Navigating to:', screenName); // Debug log
			setCurrentScreen(screenName);
			setScreenHistory(prev => [...prev, screenName]);
			if (params) {
				setScreenParams(params);
			}
		},
		goBack: () => {
			if (screenHistory.length > 1) {
				const newHistory = screenHistory.slice(0, -1);
				const previousScreen = newHistory[newHistory.length - 1];
				setScreenHistory(newHistory);
				setCurrentScreen(previousScreen);
			}
		},
	};

	const screens = React.Children.toArray(children);
	const currentScreenComponent = screens.find(
		(child) => React.isValidElement(child) && child.props.name === currentScreen
	) as ReactElement | undefined;

	if (!currentScreenComponent) {
		console.error('Screen not found:', currentScreen); // Debug log
		return null;
	}

	const screenProps = {
		navigation,
		route: { params: screenParams },
	};

	return (
		<NavigationContext.Provider value={screenProps}>
			<div style={{ flex: 1, height: '100%' }}>
				{React.cloneElement(currentScreenComponent, screenProps)}
			</div>
		</NavigationContext.Provider>
	);
}

function createNavigationComponents() {
	const NavigationContainer: ComponentType<NavigatorProps> = ({ children }) =>
		React.createElement('div', { style: { flex: 1, height: '100%' } }, children);

	const Navigator: ComponentType<NavigatorProps> = ({ children }) =>
		React.createElement(NavigationProvider, { children });

	const Screen: ComponentType<ScreenProps> = ({ component: Component, name }) => {
		const navigationContext = React.useContext(NavigationContext);
		if (!navigationContext) {
			console.error('Navigation context not found for screen:', name);
			return null;
		}

		return React.createElement(Component, {
			...navigationContext,
			name,
		});
	};

	return { NavigationContainer, Navigator, Screen };
}

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

	const { NavigationContainer, Navigator, Screen } = createNavigationComponents();

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
		ReactNavigationNative: {
			NavigationContainer,
			createNativeStackNavigator: () => ({
				Navigator,
				Screen,
			}),
		},
		ReactNavigationNativeStack: {
			NavigationContainer,
			createNativeStackNavigator: () => ({
				Navigator,
				Screen,
			}),
		},
		ReactNavigationBottomTabs: {
			createBottomTabNavigator: () => ({
				Navigator,
				Screen,
			}),
		},
		render,
		module: { exports: {} },
		exports: {},
		sendErrorReport,
		files,
	};

	let cleaned = combinedCode;
	cleaned = cleaned
		.replace(/require\(['"]react['"]\)/g, 'React')
		.replace(/require\(['"]react-dom['"]\)/g, 'ReactDOM')
		.replace(/require\(['"]react-native-web['"]\)/g, 'ReactNativeWeb')
		.replace(/require\(['"]@react-navigation\/native['"]\)/g, 'ReactNavigationNative')
		.replace(/require\(['"]@react-navigation\/native-stack['"]\)/g, 'ReactNavigationNativeStack')
		.replace(/require\(['"]@react-navigation\/bottom-tabs['"]\)/g, 'ReactNavigationBottomTabs')
		.replace(/require\(['"]@react-navigation\/stack['"]\)/g, 'ReactNavigationNativeStack')
		.replace(/require\(['"]@react-native-community\/hooks['"]\)/g, '{ useDimensions }')
		.replace(/createStackNavigator/g, 'ReactNavigationNativeStack.createNativeStackNavigator')
		.replace(/createBottomTabNavigator/g, 'ReactNavigationBottomTabs.createBottomTabNavigator')
		.replace(/NavigationContainer/g, 'ReactNavigationNative.NavigationContainer');

	return (
		<LiveProvider
			code={cleaned}
			scope={scope}
			noInline={false}
			transformCode={code => `
				(function() {
					try {
						const App = (function() {
							${code}
							return App;
						})();
						
						const appElement = React.createElement(App);
						return appElement;
					} catch (error) {
						console.error('Preview error:', error);
						const generatedCode = files['App.tsx'] || '';
						
						sendErrorReport(error, {
							component: 'Preview',
							action: 'LiveError',
							additionalData: {
								files: Object.keys(files),
								selectedFile: files[Object.keys(files)[0]] || '',
								errorStack: error.stack || null,
								errorName: error.name || 'Unknown Error',
								errorMessage: error.message || 'No error message available',
								generatedCode,
							},
						});
						throw error;
					}
				})();
			`}
		>
			<div className="relative mx-auto w-[375px] rounded-[60px] shadow-xl">
				{/* Notch */}
				<div className="absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-gray-800" />
				{/* Screen */}
				<div className="overflow-hidden rounded-[40px] bg-white m-4">
					<div style={{ paddingTop: 20 }}>
						<LivePreview
							style={{
								background: '#fff',
								minHeight: 600,
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'flex-start',
								height: '100%',
								overflow: 'auto',
							}}
						/>
					</div>
				</div>
			</div>
			<LiveError />
		</LiveProvider>
	);
}
