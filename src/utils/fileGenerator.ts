import { validateAndFixReactCode } from './codeValidator';
import { generateCodeWithOpenAI } from './openai';

export type GeneratedFile = {
	path: string;
	content: string;
};

/**
 * Parses an AI response containing a file structure object
 * @param raw The raw response string from the AI
 * @returns A record of file paths and their contents
 */
export function parseAIResponse(raw: string): Record<string, string> {
	try {
		if (!raw || typeof raw !== 'string') {
			throw new Error('Invalid input: Response must be a non-empty string');
		}

		let cleaned = raw
			.trim()
			.replace(/^```(?:json|js|javascript|typescript|tsx)?\s*/gim, '')
			.replace(/```$/gm, '')
			.replace(/^\s*[\r\n-]+/, '')
			.replace(/^\uFEFF/, '')
			.replace(/,(\s*[}\]])/g, '$1')
			.trim();

		try {
			const parsed = JSON.parse(cleaned);
			return parsed;
		} catch (error) {
			cleaned = cleaned
				.replace(/([\w.\-/]+)\s*:/g, '"$1":')
				.replace(/(?<!\\)'/g, '"')
				.replace(/\n(?=[^"]*")/g, '\\n')
				.replace(/^(?!\{)/, '{')
				// eslint-disable-next-line regexp/no-useless-assertions
				.replace(/(?!\})$/, '}');

			try {
				const parsed = JSON.parse(cleaned);
				if (!isValidFileStructure(parsed)) {
					throw new Error('La structure du fichier est invalide');
				}
				return parsed;
			} catch (secondError: unknown) {
				throw new Error(
					`Response format is invalid: ${secondError instanceof Error ? secondError.message : String(secondError)}\nThe main error is: ${error instanceof Error ? error.message : String(error)}`
				);
			}
		}
	} catch (err: unknown) {
		throw new Error(`Invalid AI response: ${err instanceof Error ? err.message : String(err)}`);
	}
}

/**
 * Validates the structure of the parsed file object
 */
function isValidFileStructure(obj: unknown): obj is Record<string, string> {
	if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
		return false;
	}

	for (const [key, value] of Object.entries(obj)) {
		if (!key.match(/^[\w\-./]+\.[a-z]+$/i)) {
			return false;
		}

		if (typeof value !== 'string' || !value.trim()) {
			return false;
		}
	}

	return true;
}

/**
 * Generates a complete React application structure with multiple files
 */
export async function generateApplicationFiles(prompt: string): Promise<GeneratedFile[]> {
	try {
		const enhancedPrompt = `
Create a complete React application structure for the following app:

${prompt}

Requirements:
- Split the UI into reusable components
- Include proper TypeScript types
- Use Tailwind CSS for styling
- Implement proper state management
- Add error handling where needed
- Include loading states
- Make the UI responsive
- Follow React best practices
- Return ONLY a valid JSON object with file paths as keys and content as strings`;

		const response = await generateCodeWithOpenAI(enhancedPrompt, {
			// eslint-disable-next-line ts/no-use-before-define
			systemPrompt: SYSTEM_PROMPT,
			temperature: 0.7,
			maxTokens: 4000,
		});
		const fileStructure = parseAIResponse(response);
		const validatedFiles: Record<string, string> = {};

		for (const [path, content] of Object.entries(fileStructure)) {
			if (path.endsWith('.tsx')) {
				const { code } = validateAndFixReactCode(content);
				validatedFiles[path] = code;
			} else {
				validatedFiles[path] = content;
			}
		}

		return Object.entries(validatedFiles).map(([path, content]) => ({
			path,
			content: content.trim(),
		}));
	} catch (error) {
		return [
			{
				path: 'App.tsx',
				content: `export default function App() {
					return (
						<div className="p-4 text-center">
							<h1 className="text-2xl font-bold mb-4">Error Generating Application</h1>
							<p className="text-red-500">
								${error instanceof Error ? error.message : 'An unknown error occurred'}
							</p>
						</div>
					);
				}`,
			},
		];
	}
}

const SYSTEM_PROMPT = `You are an expert React developer. Generate a complete React application structure with multiple files.
Follow these guidelines:
- Create separate components for better organization
- Use TypeScript and modern React practices
- Include proper imports and exports
- Implement proper component composition
- Use Tailwind CSS for styling
- Add JSDoc comments for documentation
- Handle proper type definitions

IMPORTANT: Return ONLY a valid JSON object with file paths as keys and content as strings.
Example:
{
  "App.tsx": "import { Header } from './components/Header';\n\nexport function App() { return <Header />; }",
  "components/Header.tsx": "export function Header() { return <h1>Hello</h1>; }"
}`;
