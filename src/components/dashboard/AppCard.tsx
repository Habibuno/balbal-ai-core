import { Download, Eye, Rocket } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type AppCardProps = {
	name: string;
	type: string;
	thumbnail: string;
	status: 'draft' | 'ready' | 'published';
};

export const AppCard: React.FC<AppCardProps> = ({ name, type, thumbnail, status }) => {
	const statusColors = {
		draft: 'bg-yellow-500',
		ready: 'bg-green-500',
		published: 'bg-blue-500',
	};

	return (
		<Card hover neonBorder className="overflow-hidden">
			<img src={thumbnail} alt={name} className="mb-4 h-48 w-full rounded-t-lg object-cover" />
			<div className="space-y-4">
				<div>
					<h3 className="mb-1 text-xl font-bold">{name}</h3>
					<p className="text-gray-400">{type}</p>
				</div>
				<div className="flex items-center gap-2">
					<div className={`h-2 w-2 rounded-full ${statusColors[status]}`}></div>
					<span className="text-sm capitalize">{status}</span>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" className="flex-1" icon={<Eye className="h-4 w-4" />}>
						View
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						icon={<Download className="h-4 w-4" />}
					>
						Export
					</Button>
					<Button size="sm" className="flex-1" icon={<Rocket className="h-4 w-4" />}>
						Publish
					</Button>
				</div>
			</div>
		</Card>
	);
};
