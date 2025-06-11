import { ArrowRight, Check, Diamond, Home, Rocket, Zap } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LanguageSelector } from '../components/LanguageSelector';
import { Button } from '../components/ui/Button';

type PricingTier = {
	id: 'starter' | 'pro' | 'enterprise';
	highlight?: boolean;
};

const pricingTiers: PricingTier[] = [
	{
		id: 'starter',
	},
	{
		id: 'pro',
		highlight: true,
	},
	{
		id: 'enterprise',
	},
];

function startCheckout(planId: string) {
	console.warn('Starting checkout for plan:', planId);
}

export const PricingPage: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="bg-cyber-black min-h-screen">
			{/* Navigation */}
			<div className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-cyan-400/20 bg-black/50 backdrop-blur-sm">
				<div className="container mx-auto flex h-full items-center justify-between px-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate('/')}
						icon={<Home className="h-5 w-5" />}
					>
						{t('navigation.backToHome')}
					</Button>
					<LanguageSelector />
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 pt-24">
				{/* Header */}
				<div className="mb-16 text-center">
					<h1 className="neon-glow mb-4 text-4xl font-bold md:text-5xl">{t('pricing.title')}</h1>
					<p className="mx-auto max-w-2xl text-xl text-gray-400">{t('pricing.subtitle')}</p>
				</div>

				{/* Pricing Cards */}
				<div className="mb-16 grid gap-8 md:grid-cols-3">
					{pricingTiers.map((tier) => (
						<div
							key={tier.id}
							className={`relative rounded-2xl p-8 ${
								tier.highlight
									? 'transform border-2 border-cyan-400/50 bg-gradient-to-b from-cyan-900/50 to-black hover:-translate-y-2'
									: 'border border-gray-800 bg-black/50 hover:border-cyan-400/30'
							} transition-all duration-300`}
						>
							{tier.highlight && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-cyan-400 px-4 py-1 text-sm font-bold text-black">
									{t('pricing.mostPopular')}
								</div>
							)}

							<div className="mb-8">
								<h3 className="mb-2 text-2xl font-bold">{t(`pricing.tiers.${tier.id}.name`)}</h3>
								<div className="flex items-baseline">
									<span className="text-4xl font-bold">${t(`pricing.tiers.${tier.id}.price`)}</span>
									<span className="ml-2 text-gray-400">{t('pricing.perMonth')}</span>
								</div>
								<p className="mt-4 text-gray-400">{t(`pricing.tiers.${tier.id}.description`)}</p>
							</div>

							<ul className="mb-8 space-y-4">
								{(
									t(`pricing.tiers.${tier.id}.features`, {
										returnObjects: true,
									}) as string[]
								).map((feature: string) => (
									<li key={feature} className="flex items-center">
										<Check className="mr-3 h-5 w-5 text-cyan-400" />
										<span>{feature}</span>
									</li>
								))}
							</ul>

							<Button
								onClick={() => startCheckout(tier.id)}
								className={`w-full ${
									tier.highlight ? 'cyber-button' : 'border-2 border-gray-700 hover:border-cyan-400'
								}`}
								icon={
									tier.highlight ? (
										<Rocket className="h-5 w-5" />
									) : tier.id === 'enterprise' ? (
										<Diamond className="h-5 w-5" />
									) : (
										<Zap className="h-5 w-5" />
									)
								}
							>
								{t(`pricing.tiers.${tier.id}.button`)}
							</Button>
						</div>
					))}
				</div>

				{/* Early Access CTA */}
				<div className="text-center">
					<Button
						onClick={() => navigate('/create')}
						variant="outline"
						className="group"
						icon={<Zap className="h-5 w-5 group-hover:text-cyan-400" />}
					>
						<span className="flex items-center gap-2">
							{t('pricing.earlyAccess')}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};
