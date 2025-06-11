import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

/**
 * Validates if the provided files object is valid for Sandpack
 */
export function isValidSandpackFiles(files: Record<string, string>): boolean {
	try {
		// Check if files object exists and is not empty
		if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
			return false;
		}

		// Check if App.tsx exists
		if (!files['/App.tsx']) {
			return false;
		}

		// Validate App.tsx content
		const appContent = files['/App.tsx'];
		return validateReactComponent(appContent);
	} catch (error) {
		console.error('Error validating Sandpack files:', error);
		return false;
	}
}

/**
 * Validates if the provided code is a valid React component
 */
function validateReactComponent(code: string): boolean {
	try {
		const ast = parse(code, {
			sourceType: 'module',
			plugins: ['jsx', 'typescript'],
		});

		let hasDefaultExport = false;
		let hasValidReturn = false;

		traverse(ast, {
			ExportDefaultDeclaration(path) {
				hasDefaultExport = true;
				const declaration = path.node.declaration;

				if (
					t.isFunctionDeclaration(declaration) ||
					t.isArrowFunctionExpression(declaration) ||
					t.isFunctionExpression(declaration)
				) {
					// Check function body for return statement
					traverse(
						declaration,
						{
							ReturnStatement(returnPath) {
								const returnArg = returnPath.node.argument;
								if (t.isJSXElement(returnArg) || t.isJSXFragment(returnArg)) {
									hasValidReturn = true;
								}
							},
						},
						path.scope
					);
				}
			},
		});

		return hasDefaultExport && hasValidReturn;
	} catch (error) {
		console.error('Error parsing React component:', error);
		return false;
	}
}
