// eslint-disable-next-line perfectionist/sort-named-imports
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Create } from './components/Create';
import { Dashboard } from './components/dashboard/Dashboard';
import { Landing } from './components/Landing';
import { Wizard } from './components/wizard/Wizard';
import { PricingPage } from './pages/PricingPage';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/create" element={<Create />} />
				<Route path="/wizard" element={<Wizard />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/pricing" element={<PricingPage />} />
				<Route path="/" element={<Landing />} />
			</Routes>
		</Router>
	);
}

export default App;
