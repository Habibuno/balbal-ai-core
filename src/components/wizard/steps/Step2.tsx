import React from 'react';

import { Card } from '../../ui/Card';
import { useWizard } from '../WizardContext';

const appTypes = [
	'E-commerce',
	'Social Network',
	'Fitness & Health',
	'Education',
	'Entertainment',
	'Business',
	'Lifestyle',
	'Travel',
];

export const Step2: React.FC = () => {
	const { formData, setFormData } = useWizard();

	return (
		<Card className="space-y-4">
			<h2 className="neon-glow mb-4 text-2xl font-bold">Choose App Type</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				{appTypes.map((type) => (
					<button
						key={type}
						className={`rounded-lg border-2 p-4 transition-all duration-300 ${
							formData.appType === type
								? 'border-cyan-400 bg-cyan-400/20'
								: 'border-gray-700 hover:border-gray-500'
						}`}
						onClick={() => setFormData({ ...formData, appType: type })}
					>
						{type}
					</button>
				))}
			</div>
		</Card>
	);
};
