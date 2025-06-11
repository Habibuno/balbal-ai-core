import js from '@eslint/js';
import base from '@whoa-studio/eslint-config';
import reactInternal from '@whoa-studio/eslint-config';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const baseConfig = await base();
const reactConfig = await reactInternal();

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	...baseConfig,
	...reactConfig,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'import': importPlugin,
		},
		rules: {
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	}
);
