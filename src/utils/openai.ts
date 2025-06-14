import { AI_CONFIG } from '../config/ai';
import { SYSTEM_PROMPT_MOBILE } from '../constants/prompt';
import type { OpenAiGenerateOptions } from '../types/openai';

export async function generateCodeWithOpenAI(
	prompt: string,
	options: OpenAiGenerateOptions,
	isFirstRequest: boolean,
	currentCode: string
): Promise<string> {
	try {
		const enhancedPrompt = currentCode
			? `</edit>
				${isFirstRequest
					? 'Create a new React Native mobile application with the following requirements:'
					: 'You are modifying an existing React Native mobile application. Your task is to ONLY make the specific changes requested while preserving all other existing functionality and structure.'}

				${isFirstRequest ? '' : `Current code:
				${currentCode}

				Modification requirements:
				${prompt}

				Important Instructions:
				1. DO NOT rewrite the entire application
				2. ONLY modify the parts that need to be changed according to the requirements
				3. Preserve all existing imports, components, and functionality
				4. Keep the same styling approach and structure
				5. Maintain all existing state management and hooks
				6. Only add new code if explicitly required by the changes`}

				${isFirstRequest ? prompt : ''}

				Technical Requirements:
				1. React Native Specific:
					- Use React Native components (View, Text, TouchableOpacity, etc.)
					- Use React Native specific styling and layout
					- Handle platform-specific code when needed

				2. Mobile-First Design:
					- Use proper mobile UI components and patterns
					- Ensure touch targets are at least 44x44px
					- Handle different screen sizes and orientations
					- Implement smooth transitions and animations

				3. State Management:
					- Use React hooks for state management
					- Handle loading and error states
					- Implement proper data persistence
					- Add offline support where needed

				4. Mobile Features:
					- Handle device orientation
					- Implement proper keyboard handling
					- Add pull-to-refresh where appropriate
					- Handle mobile gestures

				5. Performance:
					- Optimize for mobile devices
					- Handle memory constraints
					- Optimize images and assets

				6. Code Structure:
					- Keep all components and logic in a single file
					- Use TypeScript for type safety
					- Add proper error boundaries
					- Follow React Native best practices
					- No comments in the code

				Required File Structure:
				You MUST return a JSON object containing a single file:
				{
					"App.tsx": "${isFirstRequest ? '// Complete application code here' : '// Modified application code here'}"
				}

				The response MUST be a valid JSON object where:
				- The key is "App.tsx"
				- The value is the ${isFirstRequest ? 'complete' : 'modified'} application code as a string
				- Use proper React Native imports and components
				- Include all necessary components and logic in this single file
				- Use StyleSheet for styling
			`
			: `
				Create a complete React Native mobile application with the following requirements:

				${prompt}

				Technical Requirements:
				1. React Native Specific:
					- Use React Native components (View, Text, TouchableOpacity, etc.)
					- Use React Native specific styling and layout
					- Handle platform-specific code when needed

				2. Mobile-First Design:
					- Use proper mobile UI components and patterns
					- Ensure touch targets are at least 44x44px
					- Handle different screen sizes and orientations
					- Implement smooth transitions and animations

				3. State Management:
					- Use React hooks for state management
					- Handle loading and error states
					- Implement proper data persistence
					- Add offline support where needed

				4. Mobile Features:
					- Handle device orientation
					- Implement proper keyboard handling
					- Add pull-to-refresh where appropriate
					- Handle mobile gestures

				5. Performance:
					- Optimize for mobile devices
					- Handle memory constraints
					- Optimize images and assets

				6. Code Structure:
					- Keep all components and logic in a single file
					- Use TypeScript for type safety
					- Add proper error boundaries
					- Follow React Native best practices
					- No comments in the code

				Required File Structure:
				You MUST return a JSON object containing a single file:
				{
					"App.tsx": "// Complete application code here"
				}

				The response MUST be a valid JSON object where:
				- The key is "App.tsx"
				- The value is the complete application code as a string
				- Use proper React Native imports and components
				- Include all necessary components and logic in this single file
				- Use StyleSheet for styling
			`;

		const response = await fetch(AI_CONFIG.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
			},
			body: JSON.stringify({
				model: options.model || 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content: options.systemPrompt || SYSTEM_PROMPT_MOBILE,
					},
					{
						role: 'user',
						content: enhancedPrompt,
					},
				],
				temperature: options.temperature || 0.7,
				max_tokens: options.maxTokens || 6000,
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to generate code');
		}

		const data = await response.json();
		return data.choices[0].message.content;
	} catch (error) {
		console.error('Error generating code:', error);
		throw error;
	}
}
