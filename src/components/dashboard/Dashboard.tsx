import { Home, Plus } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LanguageSelector } from '../LanguageSelector';
import { Button } from '../ui/Button';
import { AppCard } from './AppCard';

const mockApps = [
	{
		name: 'FitTracker Pro',
		type: 'Fitness & Health',
		thumbnail:
			'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60',
		status: 'published' as const,
	},
	{
		name: 'EduLearn',
		type: 'Education',
		thumbnail:
			'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60',
		status: 'ready' as const,
	},
	{
		name: 'SocialConnect',
		type: 'Social Network',
		thumbnail:
			'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&auto=format&fit=crop&q=60',
		status: 'draft' as const,
	},
];

export const Dashboard: React.FC = () => {
	const { t } = useTranslation();

	return (
		<div className="bg-cyber-black min-h-screen px-4 py-12">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link to="/">
							<Button variant="outline" icon={<Home className="h-5 w-5" />}>
								{t('navigation.backToHome')}
							</Button>
						</Link>
						<h1 className="neon-glow text-3xl font-bold">My Apps</h1>
					</div>
					<div className="flex items-center gap-4">
						<LanguageSelector />
						<Button icon={<Plus className="h-5 w-5" />}>Create New App</Button>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{mockApps.map((app) => (
						<AppCard key={app.name} {...app} />
					))}
				</div>
			</div>
		</div>
	);
};
