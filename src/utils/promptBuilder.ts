import type { GenerateOptions } from './openai';

/**
 * Configuration for the prompt builder
 */
type PromptConfig = {
	includeTests?: boolean;
	styleFramework?: 'tailwind' | 'css-modules';
	componentStyle?: 'functional' | 'class';
	typescript?: boolean;
	stateManagement?: 'useState' | 'useReducer' | 'context';
};

const DEFAULT_CONFIG: PromptConfig = {
	includeTests: false,
	styleFramework: 'tailwind',
	componentStyle: 'functional',
	typescript: true,
	stateManagement: 'useState',
};

/**
 * Builds an enhanced prompt for the OpenAI API
 */
export function buildEnhancedPrompt(
	userPrompt: string,
	config: Partial<PromptConfig> = {}
): string {
	const finalConfig = { ...DEFAULT_CONFIG, ...config };

	return `
As an expert React developer, create a complete, production-ready application with the following requirements:

APPLICATION DESCRIPTION:
${userPrompt}

TECHNICAL REQUIREMENTS:

1. Project Structure:
- Create modular, reusable components
- Follow React best practices and patterns
- Use TypeScript for type safety
- Implement proper error handling
- Add loading states where needed
- Make the UI fully responsive

2. Required Files:
- App.tsx (main entry point)
- Multiple component files in /components
- Utility functions if needed
- Types/interfaces in separate files

3. Styling:
- Use Tailwind CSS for all styling
- Follow a consistent color scheme
- Implement responsive design patterns
- Add smooth transitions and hover states
- Ensure proper spacing and alignment

4. Component Guidelines:
- Write functional components with hooks
- Add proper TypeScript types/interfaces
- Include JSDoc comments for documentation
- Implement proper prop validation
- Handle edge cases and errors
- Add loading states where appropriate

5. State Management:
- Use ${finalConfig.stateManagement} for state
- Implement proper data flow
- Handle side effects correctly
- Manage loading and error states

6. Code Quality:
- Follow clean code principles
- Add meaningful comments
- Use consistent naming conventions
- Implement proper error boundaries
- Handle all possible states (loading, error, empty)

RESPONSE FORMAT:
Return ONLY a valid JSON object with file paths as keys and their content as strings:

{
  "App.tsx": "// App component code",
  "components/Header.tsx": "// Header component code",
  "components/Button.tsx": "// Button component code",
  "types/index.ts": "// TypeScript interfaces",
  "utils/helpers.ts": "// Utility functions"
}

CRITICAL REQUIREMENTS:
- Code must be complete and functional
- Include all necessary imports
- Use proper TypeScript types
- Add error handling
- Make UI responsive
- Follow React best practices
- Include loading states
- Handle edge cases
`.trim();
}

/**
 * Validates the generated files structure
 */
export function validateGeneratedFiles(files: Record<string, string>): boolean {
	// Ensure we have at least App.tsx and one component
	if (!files['App.tsx'] || Object.keys(files).length < 2) {
		return false;
	}

	// Check for required file types
	const hasComponents = Object.keys(files).some(
		(path) => path.startsWith('components/') && path.endsWith('.tsx')
	);

	const hasTypes = Object.keys(files).some(
		(path) => path.includes('types') && path.endsWith('.ts')
	);

	return hasComponents && hasTypes;
}

/**
 * Builds the complete options for the OpenAI API call
 */
export function buildGenerateOptions(): GenerateOptions {
	return {
		model: 'gpt-4-turbo-preview',
		temperature: 0.7,
		maxTokens: 4000,
		systemPrompt: `You are an expert React developer who creates production-ready applications.
Always return complete, working code that follows best practices and includes proper error handling.
Your response must be a valid JSON object containing multiple TypeScript files.`,
		// responseFormat: 'json_object',
	};
}
