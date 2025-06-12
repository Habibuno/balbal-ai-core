import { AI_CONFIG } from '../config/ai';
import { SYSTEM_PROMPT } from '../constants/prompt';

type GeneratedFiles = {
	[key: string]: string;
};

export async function generateApplication(prompt: string): Promise<GeneratedFiles> {
	try {
		const response = await fetch(AI_CONFIG.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: SYSTEM_PROMPT,
					},
					{
						role: 'user',
						content: `Create a complete React application structure for: ${prompt}\n\nRequirements:\n- Split into reusable components\n- Use TypeScript\n- Use Tailwind CSS\n- Add error handling\n- Make it responsive`,
					},
				],
				temperature: 0.7,
				max_tokens: 4000,
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to generate code');
		}

		const data = await response.json();
		const generatedCode = data.choices[0].message.content;

		try {
			const cleanCode = generatedCode
				.replace(/```(?:javascript|json)?\n([\s\S]*?)```/g, '$1')
				.trim();

			return JSON.parse(cleanCode);
		} catch (parseError) {
			console.error('Error parsing generated code:', parseError);

			return {
				'App.tsx': `export default function App() {
          return (
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p className="text-red-500">Failed to parse generated code</p>
              <pre className="mt-4 p-4 bg-gray-100 rounded">
                ${generatedCode}
              </pre>
            </div>
          );
        }`,
			};
		}
	} catch (error) {
		console.error('Error generating application:', error);
		throw error;
	}
}
