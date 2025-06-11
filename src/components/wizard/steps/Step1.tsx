import React from 'react';

import { Card } from '../../ui/Card';
import { useWizard } from '../WizardContext';

export const Step1: React.FC = () => {
	const { formData, setFormData } = useWizard();

	return (
		<Card className="space-y-4">
			<h2 className="neon-glow mb-4 text-2xl font-bold">Name Your App</h2>
			<div>
				<label className="mb-2 block text-sm font-medium text-gray-400">App Name</label>
				<input
					type="text"
					value={formData.appName}
					onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
					className="w-full rounded-md border-2 border-cyan-400/20 bg-black/50 p-3 text-white transition-colors focus:border-cyan-400"
					placeholder="Enter your app name"
				/>
			</div>
		</Card>
	);
};
