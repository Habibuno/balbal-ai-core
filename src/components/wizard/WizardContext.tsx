import type React from 'react';
import { createContext, useContext, useState } from 'react';

type WizardContextType = {
	currentStep: number;
	formData: AppFormData;
	setFormData: (data: AppFormData) => void;
	nextStep: () => void;
	prevStep: () => void;
	isLastStep: boolean;
};

export type AppFormData = {
	appName: string;
	appType: string;
	targetAudience: string;
	features: string[];
	style: string;
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<AppFormData>({
		appName: '',
		appType: '',
		targetAudience: '',
		features: [],
		style: '',
	});

	const totalSteps = 5;

	const nextStep = () => {
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	return (
		<WizardContext.Provider
			value={{
				currentStep,
				formData,
				setFormData,
				nextStep,
				prevStep,
				isLastStep: currentStep === totalSteps,
			}}
		>
			{children}
		</WizardContext.Provider>
	);
};

export function useWizard() {
	const context = useContext(WizardContext);
	if (!context) {
		throw new Error('useWizard must be used within a WizardProvider');
	}
	return context;
}
