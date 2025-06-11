import { Code, CreditCard, Rocket, Smartphone, Sparkles, Target, Zap } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/Button';

export const Landing: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleGetStarted = () => {
		navigate('/create');
	};

	return (
		<div className="bg-cyber-black min-h-screen">
			{/* Top Bar */}
			<div className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-cyan-400/20 bg-black/50 backdrop-blur-sm">
				<div className="container mx-auto flex h-full items-center justify-between px-4">
					<div className="flex items-center gap-4">
						{/* Rocket Emoji */}
						<div className="text-2xl">🚀</div>

						{/* Start Button */}
						<Button
							icon={<Zap className="h-5 w-5" />}
							onClick={handleGetStarted}
							size="sm"
							className="cyber-button"
						>
							{t('hero.cta')}
						</Button>

						{/* Pricing Button */}
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate('/pricing')}
							icon={<CreditCard className="h-5 w-5" />}
						>
							{t('navigation.pricing')}
						</Button>
					</div>

					<LanguageSelector />
				</div>
			</div>

			{/* Hero Section */}
			<header className="relative mt-16 overflow-hidden py-24">
				<div className="cyber-gradient absolute inset-0 opacity-10"></div>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl text-center">
						<h1 className="neon-glow mb-6 text-5xl font-bold md:text-7xl">{t('hero.title')}</h1>
						<p className="whitespace-pre-line text-xl text-cyan-400 md:text-2xl">
							{t('hero.subtitle')}
						</p>
					</div>
				</div>
			</header>

			{/* Features Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<h2 className="neon-glow mb-16 text-center text-3xl font-bold">{t('features.title')}</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{[
							{
								icon: <Sparkles className="h-8 w-8 text-cyan-400" />,
								title: t('features.aiPowered.title'),
								description: t('features.aiPowered.description'),
							},
							{
								icon: <Code className="h-8 w-8 text-purple-500" />,
								title: t('features.noCode.title'),
								description: t('features.noCode.description'),
							},
							{
								icon: <Rocket className="h-8 w-8 text-pink-500" />,
								title: t('features.deploy.title'),
								description: t('features.deploy.description'),
							},
						].map((feature, index) => (
							<div key={index} className="neon-border card-hover rounded-lg bg-black/50 p-6">
								<div className="mb-4">{feature.icon}</div>
								<h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
								<p className="text-gray-400">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="to-cyber-black bg-gradient-to-b from-black py-20">
				<div className="container mx-auto px-4">
					<h2 className="neon-glow mb-16 text-center text-3xl font-bold">
						{t('howItWorks.title')}
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
						{[
							{
								step: '01',
								title: t('howItWorks.steps.describe.title'),
								description: t('howItWorks.steps.describe.description'),
								icon: <Target className="h-6 w-6" />,
							},
							{
								step: '02',
								title: t('howItWorks.steps.generate.title'),
								description: t('howItWorks.steps.generate.description'),
								icon: <Sparkles className="h-6 w-6" />,
							},
							{
								step: '03',
								title: t('howItWorks.steps.customize.title'),
								description: t('howItWorks.steps.customize.description'),
								icon: <Smartphone className="h-6 w-6" />,
							},
							{
								step: '04',
								title: t('howItWorks.steps.deploy.title'),
								description: t('howItWorks.steps.deploy.description'),
								icon: <Rocket className="h-6 w-6" />,
							},
						].map((step, index) => (
							<div
								key={index}
								className="card-hover relative rounded-lg border border-cyan-400/20 bg-black/30 p-6"
							>
								<div className="absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 font-bold text-black">
									{step.step}
								</div>
								<div className="mb-4 text-cyan-400">{step.icon}</div>
								<h3 className="mb-2 text-xl font-bold">{step.title}</h3>
								<p className="text-gray-400">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 text-center">
					<div className="mx-auto max-w-3xl">
						<h2 className="neon-glow mb-8 text-4xl font-bold">{t('cta.title')}</h2>
						<p className="mb-8 text-xl text-gray-400">{t('cta.description')}</p>
						<div className="flex items-center justify-center gap-4">
							<Button icon={<Zap className="h-5 w-5" />} onClick={handleGetStarted}>
								{t('cta.button')}
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-cyan-400/20 py-8">
				<div className="container mx-auto px-4 text-center">
					<p className="text-gray-400">{t('footer.copyright')}</p>
				</div>
			</footer>
		</div>
	);
};
