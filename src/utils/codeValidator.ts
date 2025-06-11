import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

type ValidationResult = {
	isValid: boolean;
	code: string;
	errors: string[];
};

/**
 * Valide et corrige le code React généré
 */
export function validateAndFixReactCode(code: string): ValidationResult {
	const result: ValidationResult = {
		isValid: false,
		code,
		errors: [],
	};

	try {
		const ast = parse(code, {
			sourceType: 'module',
			plugins: ['jsx', 'typescript'],
		});

		let hasDefaultExport = false;
		let hasReturnStatement = false;
		let isReactComponent = false;

		// Analyse l'AST
		traverse(ast, {
			ExportDefaultDeclaration(path) {
				hasDefaultExport = true;
				const declaration = path.node.declaration;

				if (t.isFunctionDeclaration(declaration) || t.isArrowFunctionExpression(declaration)) {
					isReactComponent = true;
				}
			},
			ReturnStatement(path) {
				if (path.findParent((p) => p.isExportDefaultDeclaration())) {
					hasReturnStatement = true;
					const returnValue = path.node.argument;
					if (t.isJSXElement(returnValue) || t.isJSXFragment(returnValue)) {
						isReactComponent = true;
					}
				}
			},
		});

		// Vérifie et corrige si nécessaire
		if (!hasDefaultExport || !hasReturnStatement || !isReactComponent) {
			result.code = `export default function App() {
  return (
    <div className="p-4">
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {${JSON.stringify(code)}}
      </pre>
    </div>
  );
}`;
			result.errors.push(
				'Code non valide pour un composant React - Enveloppé dans un composant de fallback'
			);
		} else {
			result.isValid = true;
			// Régénère le code à partir de l'AST pour le nettoyer
			result.code = generate(ast).code;
		}
	} catch (error) {
		result.code = `export default function App() {
  return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <h3 className="text-red-800 font-semibold mb-2">Erreur de syntaxe</h3>
        <pre className="whitespace-pre-wrap font-mono text-sm text-red-600">
          ${error instanceof Error ? error.message : 'Erreur inconnue'}
        </pre>
      </div>
    </div>
  );
}`;
		result.errors.push('Erreur de syntaxe dans le code généré');
	}

	return result;
}

/**
 * Valide la structure des fichiers générés
 */
export function validateFileStructure(files: Record<string, string>): boolean {
	try {
		// Vérifie la présence de App.tsx
		if (!files['App.tsx']) {
			throw new Error('Missing App.tsx file');
		}

		// Vérifie les chemins de fichiers
		const validPathRegex = /^[\w/-]+\.[a-z]+$/i;
		const invalidPaths = Object.keys(files).filter((path) => !validPathRegex.test(path));
		if (invalidPaths.length > 0) {
			throw new Error(`Invalid file paths: ${invalidPaths.join(', ')}`);
		}

		// Vérifie le contenu des fichiers
		const emptyFiles = Object.entries(files)
			.filter(([_, content]) => !content.trim())
			.map(([path]) => path);
		if (emptyFiles.length > 0) {
			throw new Error(`Empty files: ${emptyFiles.join(', ')}`);
		}

		return true;
	} catch (error) {
		console.error('File structure validation error:', error);
		return false;
	}
}
