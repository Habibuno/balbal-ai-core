import { ArrowLeft, ArrowRight } from 'lucide-react';
import type React from 'react';

import { Button } from '../ui/Button';
import { useWizard } from './WizardContext';

const steps = [
	{ title: 'App Name', description: 'Name your application' },
	{ title: 'App Type', description: 'Choose your app category' },
	{ title: 'Target Audience', description: 'Define your users' },
	{ title: 'Features', description: 'Select app features' },
	{ title: 'Style', description: 'Choose app design' },
];

type StepProps = {
	children: React.ReactNode;
};

export const WizardSteps: React.FC<StepProps> = ({ children }) => {
	const { currentStep, prevStep, nextStep, isLastStep } = useWizard();

	return (
		<div className="mx-auto max-w-4xl">
			{/* Progress bar */}
			<div className="mb-8">
				<div className="mb-4 flex justify-between">
					{steps.map((step, index) => (
						<div
							key={step.title}
							className={`flex flex-col items-center ${
								index + 1 <= currentStep ? 'text-cyan-400' : 'text-gray-500'
							}`}
						>
							<div
								className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${
									index + 1 <= currentStep ? 'bg-cyan-400 text-black' : 'bg-gray-800'
								}`}
							>
								{index + 1}
							</div>
							<div className="text-sm font-medium">{step.title}</div>
						</div>
					))}
				</div>
				<div className="relative">
					<div className="absolute h-1 w-full rounded bg-gray-800" />
					<div
						className="absolute h-1 rounded bg-cyan-400 transition-all duration-300"
						style={{
							width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
						}}
					>
					</div>
				</div>
			</div>

			{/* Step content */}
			<div className="mb-8">{children}</div>

			{/* Navigation and Chat */}
			<div className="flex flex-col gap-4">
				<div className="flex justify-between">
					<Button
						variant="outline"
						onClick={prevStep}
						disabled={currentStep === 1}
						icon={<ArrowLeft className="h-4 w-4" />}
					>
						Previous
					</Button>
					<Button onClick={nextStep} icon={<ArrowRight className="h-4 w-4" />}>
						{isLastStep ? 'Generate App' : 'Next'}
					</Button>
				</div>
			</div>
		</div>
	);
};
