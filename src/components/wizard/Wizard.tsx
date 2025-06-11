import { Home } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LanguageSelector } from '../LanguageSelector';
import { Button } from '../ui/Button';
import { AIChat } from './AIChat';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5';
import { WizardProvider } from './WizardContext';
import { WizardSteps } from './WizardSteps';

export const Wizard: React.FC = () => {
	const { t } = useTranslation();

	const renderStep = (step: number) => {
		switch (step) {
			case 1:
				return <Step1 />;
			case 2:
				return <Step2 />;
			case 3:
				return <Step3 />;
			case 4:
				return <Step4 />;
			case 5:
				return <Step5 />;
			default:
				return null;
		}
	};

	return (
		<WizardProvider>
			<div className="bg-cyber-black min-h-screen px-4 py-12">
				<div className="mx-auto max-w-6xl">
					<div className="mb-8 flex items-center justify-between">
						<Link to="/">
							<Button variant="outline" icon={<Home className="h-5 w-5" />}>
								{t('navigation.backToHome')}
							</Button>
						</Link>
						<LanguageSelector />
					</div>
					<h1 className="neon-glow mb-12 text-center text-4xl font-bold">{t('hero.title')}</h1>
					<WizardSteps>{({ currentStep }) => renderStep(currentStep)}</WizardSteps>
					<AIChat />
				</div>
			</div>
		</WizardProvider>
	);
};
