import React from 'react';

import { Card } from '../../ui/Card';
import { useWizard } from '../WizardContext';

const styles = [
	{
		name: 'Modern Minimal',
		description: 'Clean and simple design with focus on content',
		preview:
			'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=60',
	},
	{
		name: 'Bold & Vibrant',
		description: 'Colorful and energetic design style',
		preview:
			'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=60',
	},
	{
		name: 'Elegant Dark',
		description: 'Sophisticated dark theme with accent colors',
		preview:
			'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&auto=format&fit=crop&q=60',
	},
	{
		name: 'Playful',
		description: 'Fun and engaging design with illustrations',
		preview:
			'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&auto=format&fit=crop&q=60',
	},
];

export const Step5: React.FC = () => {
	const { formData, setFormData } = useWizard();

	return (
		<Card className="space-y-4">
			<h2 className="neon-glow mb-4 text-2xl font-bold">Choose Style</h2>
			<div className="grid grid-cols-2 gap-4">
				{styles.map((style) => (
					<button
						key={style.name}
						className={`overflow-hidden rounded-lg transition-all duration-300 ${
							formData.style === style.name
								? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black'
								: 'hover:scale-105'
						}`}
						onClick={() => setFormData({ ...formData, style: style.name })}
					>
						<img src={style.preview} alt={style.name} className="h-40 w-full object-cover" />
						<div className="bg-black/90 p-4">
							<h3 className="mb-1 font-bold">{style.name}</h3>
							<p className="text-sm text-gray-400">{style.description}</p>
						</div>
					</button>
				))}
			</div>
		</Card>
	);
};
