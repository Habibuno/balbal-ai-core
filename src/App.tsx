// eslint-disable-next-line perfectionist/sort-named-imports
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Create } from './components/Create';
import { Dashboard } from './components/dashboard/Dashboard';
import { Landing } from './components/Landing';
import { BetaBanner } from './components/ui/BetaBanner';
import { Wizard } from './components/wizard/Wizard';
import { PricingPage } from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';

function App() {
	return (
		<Router>
			<div className="flex min-h-screen flex-col">
				<BetaBanner />
				<main className="flex-1">
					<Routes>
						<Route path="/create" element={<Create />} />
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="/wizard" element={<Wizard />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/pricing" element={<PricingPage />} />
						<Route path="/" element={<Landing />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
