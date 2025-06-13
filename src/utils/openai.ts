import { AI_CONFIG } from '../config/ai';
import { SYSTEM_PROMPT_MOBILE } from '../constants/prompt';
import type { OpenAiGenerateOptions } from '../types/openai';

export async function generateCodeWithOpenAI(
	prompt: string,
	options: Partial<OpenAiGenerateOptions> = {}
): Promise<string> {
	try {
		const enhancedPrompt = `
			Create a complete React Native mobile application with the following requirements:

			${prompt}

			Technical Requirements:
			1. React Native Specific:
				- Use React Native components (View, Text, TouchableOpacity, etc.)
				- Implement proper navigation using @react-navigation/native
				- Use React Native specific styling and layout
				- Handle platform-specific code when needed

			2. Mobile-First Design:
				- Use proper mobile UI components and patterns
				- Ensure touch targets are at least 44x44px
				- Handle different screen sizes and orientations
				- Implement smooth transitions and animations

			3. Navigation:
				- Set up proper screen navigation using React Navigation
				- Handle back navigation
				- Implement bottom tabs or drawer if needed
				- Add proper navigation headers
				- Don't use createStackNavigator, use createNativeStackNavigator instead

			4. State Management:
				- Use React Context or Redux for global state
				- Handle loading and error states
				- Implement proper data persistence
				- Add offline support where needed

			5. Mobile Features:
				- Handle device orientation
				- Implement proper keyboard handling
				- Add pull-to-refresh where appropriate
				- Handle mobile gestures

			6. Performance:
				- Optimize for mobile devices
				- Implement proper lazy loading
				- Handle memory constraints
				- Optimize images and assets

			7. Code Structure:
				- Split into reusable components
				- Use TypeScript for type safety
				- Add proper error boundaries
				- Follow React Native best practices

			Required File Structure:
			You MUST return a JSON object containing multiple files organized in the following structure:
			1. Main application file (e.g., App.tsx)
			2. Multiple screen components in a 'screens' directory
			3. Multiple reusable components in a 'components' directory
			4. Utility files in a 'utils' directory
			5. Type definitions in a 'types' directory

			Each file should contain complete, working React Native code. The response MUST be a valid JSON object where:
			- Keys are the file paths (without 'src/' prefix)
			- Values are the complete file contents as strings
			- File names should be descriptive of their purpose
			- Use proper React Native imports and components

			Example response format:
			{
				"App.tsx": "import React from 'react'; import { NavigationContainer } from '@react-navigation/native'; ...",
				"screens/UserProfileScreen.tsx": "import React from 'react'; import { View, Text } from 'react-native'; ...",
				"components/UserAvatar.tsx": "import React from 'react'; import { Image } from 'react-native'; ...",
				...
			}
		`;

		const response = await fetch(AI_CONFIG.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
			},
			body: JSON.stringify({
				model: options.model || 'gpt-3.5-turbo',
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
				max_tokens: options.maxTokens || 4000,
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
