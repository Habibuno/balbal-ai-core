import { Sparkles } from 'lucide-react';

export function BetaBanner() {
	return (
		<div className="flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 py-2 text-sm font-medium text-white">
			<Sparkles className="mr-2 h-4 w-4" />
			Version Beta - Fonctionnalités en cours de développement
		</div>
	);
} 