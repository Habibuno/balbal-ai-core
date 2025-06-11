import React from 'react';

import { Card } from '../../ui/Card';
import { useWizard } from '../WizardContext';

const audiences = [
	'General Consumers',
	'Business Professionals',
	'Students',
	'Fitness Enthusiasts',
	'Travelers',
	'Creative Professionals',
	'Tech-savvy Users',
	'Senior Citizens',
];

export const Step3: React.FC = () => {
	const { formData, setFormData } = useWizard();

	return (
		<Card className="space-y-4">
			<h2 className="neon-glow mb-4 text-2xl font-bold">Target Audience</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				{audiences.map((audience) => (
					<button
						key={audience}
						className={`rounded-lg border-2 p-4 transition-all duration-300 ${
							formData.targetAudience === audience
								? 'border-cyan-400 bg-cyan-400/20'
								: 'border-gray-700 hover:border-gray-500'
						}`}
						onClick={() => setFormData({ ...formData, targetAudience: audience })}
					>
						{audience}
					</button>
				))}
			</div>
		</Card>
	);
};
