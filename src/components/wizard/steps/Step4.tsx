import { Check } from 'lucide-react';
import React from 'react';

import { Card } from '../../ui/Card';
import { useWizard } from '../WizardContext';

const features = [
	'User Authentication',
	'Social Sharing',
	'Push Notifications',
	'In-App Messaging',
	'Analytics Dashboard',
	'Payment Integration',
	'Offline Mode',
	'Cloud Sync',
	'Dark/Light Theme',
	'Search Functionality',
	'User Profiles',
	'Settings Panel',
];

export const Step4: React.FC = () => {
	const { formData, setFormData } = useWizard();

	const toggleFeature = (feature: string) => {
		const newFeatures = formData.features.includes(feature)
			? formData.features.filter((f) => f !== feature)
			: [...formData.features, feature];
		setFormData({ ...formData, features: newFeatures });
	};

	return (
		<Card className="space-y-4">
			<h2 className="neon-glow mb-4 text-2xl font-bold">Select Features</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				{features.map((feature) => {
					const isSelected = formData.features.includes(feature);
					return (
						<button
							key={feature}
							className={`flex items-center gap-2 rounded-lg border-2 p-4 transition-all duration-300 ${
								isSelected
									? 'border-cyan-400 bg-cyan-400/20'
									: 'border-gray-700 hover:border-gray-500'
							}`}
							onClick={() => toggleFeature(feature)}
						>
							<div
								className={`flex h-5 w-5 items-center justify-center rounded border ${
									isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-gray-500'
								}`}
							>
								{isSelected && <Check className="h-4 w-4 text-black" />}
							</div>
							{feature}
						</button>
					);
				})}
			</div>
		</Card>
	);
};
