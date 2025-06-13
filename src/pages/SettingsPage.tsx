import { ArrowLeft, Bell, Eye, Globe, Lock, Moon, Save, Settings, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { UserProfile } from '../types/user';

// Mock data - À remplacer par les vraies données de l'API
const mockUser: UserProfile = {
	id: '1',
	email: 'user@example.com',
	displayName: 'John Doe',
	avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
	role: 'user',
	createdAt: '2024-01-01T00:00:00Z',
	lastLogin: '2024-03-20T12:00:00Z',
	preferences: {
		theme: 'dark',
		language: 'fr',
		notifications: {
			email: true,
			push: true,
			marketing: false,
			updates: true,
		},
		display: {
			fontSize: 'medium',
			density: 'comfortable',
			animations: true,
			reducedMotion: false,
		},
		privacy: {
			profileVisibility: 'public',
			showOnlineStatus: true,
			showLastSeen: true,
		},
	},
	security: {
		twoFactorEnabled: false,
		lastPasswordChange: '2024-02-15T00:00:00Z',
		loginHistory: [
			{
				date: '2024-03-20T12:00:00Z',
				device: 'MacBook Pro',
				location: 'Paris, France',
			},
			{
				date: '2024-03-19T15:30:00Z',
				device: 'iPhone 13',
				location: 'Paris, France',
			},
		],
	},
	subscription: {
		plan: 'pro',
		status: 'active',
		expiresAt: '2024-12-31T23:59:59Z',
		autoRenew: true,
		paymentMethod: {
			type: 'card',
			last4: '4242',
			expiryDate: '12/25',
		},
	},
};

export default function SettingsPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [user, setUser] = useState<UserProfile>(mockUser);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		setIsSaving(true);
		// TODO: Implémenter la sauvegarde des paramètres
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSaving(false);
	};

	return (
		<div className="container mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						onClick={() => navigate('/create')}
						icon={<ArrowLeft className="h-5 w-5" />}
						size="sm"
					>
						{t('navigation.backToHome')}
					</Button>
					<h1 className="neon-glow text-3xl font-bold">Paramètres</h1>
				</div>
			</div>

			{/* Profil */}
			<Card className="space-y-6">
				<div className="flex items-center gap-4">
					<img
						src={user.avatar}
						alt={user.displayName}
						className="h-20 w-20 rounded-full border-2 border-cyan-400"
					/>
					<div>
						<h2 className="text-2xl font-bold">{user.displayName}</h2>
						<p className="text-gray-400">{user.email}</p>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<label htmlFor="displayName" className="mb-2 block text-sm font-medium">Nom d'affichage</label>
						<input
							id="displayName"
							type="text"
							value={user.displayName}
							onChange={(e) => setUser({ ...user, displayName: e.target.value })}
							className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
						/>
					</div>
					<div>
						<label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
						<input
							id="email"
							type="email"
							value={user.email}
							onChange={(e) => setUser({ ...user, email: e.target.value })}
							className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
						/>
					</div>
				</div>
			</Card>

			{/* Préférences */}
			<Card className="space-y-6">
				<h2 className="text-xl font-bold">Préférences</h2>

				<div className="grid gap-6 md:grid-cols-2">
					{/* Thème */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Moon className="h-5 w-5" />
							<h3 className="font-medium">Thème</h3>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setUser({ ...user, preferences: { ...user.preferences, theme: 'light' } })}
								className={`flex items-center gap-2 rounded-lg border p-2 ${
									user.preferences.theme === 'light' ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-700'
								}`}
							>
								<Sun className="h-4 w-4" />
								Clair
							</button>
							<button
								type="button"
								onClick={() => setUser({ ...user, preferences: { ...user.preferences, theme: 'dark' } })}
								className={`flex items-center gap-2 rounded-lg border p-2 ${
									user.preferences.theme === 'dark' ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-700'
								}`}
							>
								<Moon className="h-4 w-4" />
								Sombre
							</button>
							<button
								type="button"
								onClick={() => setUser({ ...user, preferences: { ...user.preferences, theme: 'system' } })}
								className={`flex items-center gap-2 rounded-lg border p-2 ${
									user.preferences.theme === 'system' ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-700'
								}`}
							>
								<Globe className="h-4 w-4" />
								Système
							</button>
						</div>
					</div>

					{/* Notifications */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							<h3 className="font-medium">Notifications</h3>
						</div>
						<div className="space-y-2">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={user.preferences.notifications.email}
									onChange={(e) =>
										setUser({
											...user,
											preferences: {
												...user.preferences,
												notifications: { ...user.preferences.notifications, email: e.target.checked },
											},
										})}
									className="h-4 w-4 rounded border-gray-700 bg-gray-800"
								/>
								Notifications par email
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={user.preferences.notifications.push}
									onChange={(e) =>
										setUser({
											...user,
											preferences: {
												...user.preferences,
												notifications: { ...user.preferences.notifications, push: e.target.checked },
											},
										})}
									className="h-4 w-4 rounded border-gray-700 bg-gray-800"
								/>
								Notifications push
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={user.preferences.notifications.marketing}
									onChange={(e) =>
										setUser({
											...user,
											preferences: {
												...user.preferences,
												notifications: { ...user.preferences.notifications, marketing: e.target.checked },
											},
										})}
									className="h-4 w-4 rounded border-gray-700 bg-gray-800"
								/>
								Emails marketing
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={user.preferences.notifications.updates}
									onChange={(e) =>
										setUser({
											...user,
											preferences: {
												...user.preferences,
												notifications: { ...user.preferences.notifications, updates: e.target.checked },
											},
										})}
									className="h-4 w-4 rounded border-gray-700 bg-gray-800"
								/>
								Mises à jour du produit
							</label>
						</div>
					</div>
				</div>

				{/* Affichage */}
				<div className="mt-6 space-y-6">
					<h3 className="flex items-center gap-2 text-lg font-medium">
						<Settings className="h-5 w-5" />
						Affichage
					</h3>
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<label htmlFor="fontSize" className="mb-2 block text-sm font-medium">Taille du texte</label>
							<select
								value={user.preferences.display.fontSize}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											display: { ...user.preferences.display, fontSize: e.target.value as 'small' | 'medium' | 'large' },
										},
									})}
								className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
							>
								<option value="small">Petit</option>
								<option value="medium">Moyen</option>
								<option value="large">Grand</option>
							</select>
						</div>
						<div>
							<label htmlFor="density" className="mb-2 block text-sm font-medium">Densité</label>
							<select
								value={user.preferences.display.density}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											display: { ...user.preferences.display, density: e.target.value as 'comfortable' | 'compact' },
										},
									})}
								className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
							>
								<option value="comfortable">Confortable</option>
								<option value="compact">Compact</option>
							</select>
						</div>
					</div>
					<div className="space-y-2">
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								id="animations"
								checked={user.preferences.display.animations}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											display: { ...user.preferences.display, animations: e.target.checked },
										},
									})}
								className="h-4 w-4 rounded border-gray-700 bg-gray-800"
							/>
							<label htmlFor="animations">Activer les animations</label>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								id="reducedMotion"
								checked={user.preferences.display.reducedMotion}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											display: { ...user.preferences.display, reducedMotion: e.target.checked },
										},
									})}
								className="h-4 w-4 rounded border-gray-700 bg-gray-800"
							/>
							<label htmlFor="reducedMotion">Réduire les mouvements</label>
						</label>
					</div>
				</div>

				{/* Confidentialité */}
				<div className="mt-6 space-y-6">
					<h3 className="flex items-center gap-2 text-lg font-medium">
						<Eye className="h-5 w-5" />
						Confidentialité
					</h3>
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<label htmlFor="profileVisibility" className="mb-2 block text-sm font-medium">Visibilité du profil</label>
							<select
								value={user.preferences.privacy.profileVisibility}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											privacy: {
												...user.preferences.privacy,
												profileVisibility: e.target.value as 'public' | 'private' | 'contacts',
											},
										},
									})}
								className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
							>
								<option value="public">Public</option>
								<option value="private">Privé</option>
								<option value="contacts">Contacts uniquement</option>
							</select>
						</div>
					</div>
					<div className="space-y-2">
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								id="showOnlineStatus"
								checked={user.preferences.privacy.showOnlineStatus}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											privacy: { ...user.preferences.privacy, showOnlineStatus: e.target.checked },
										},
									})}
								className="h-4 w-4 rounded border-gray-700 bg-gray-800"
							/>
							<label htmlFor="showOnlineStatus">Afficher le statut en ligne</label>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								id="showLastSeen"
								checked={user.preferences.privacy.showLastSeen}
								onChange={(e) =>
									setUser({
										...user,
										preferences: {
											...user.preferences,
											privacy: { ...user.preferences.privacy, showLastSeen: e.target.checked },
										},
									})}
								className="h-4 w-4 rounded border-gray-700 bg-gray-800"
							/>
							<label htmlFor="showLastSeen">Afficher la dernière connexion</label>
						</label>
					</div>
				</div>
			</Card>

			{/* Sécurité */}
			<Card className="space-y-6">
				<h2 className="flex items-center gap-2 text-xl font-bold">
					<Lock className="h-5 w-5" />
					Sécurité
				</h2>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium">Authentification à deux facteurs</h3>
							<p className="text-sm text-gray-400">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
						</div>
						<Button
							variant={user.security.twoFactorEnabled ? 'outline' : 'primary'}
							onClick={() =>
								setUser({
									...user,
									security: { ...user.security, twoFactorEnabled: !user.security.twoFactorEnabled },
								})}
						>
							{user.security.twoFactorEnabled ? 'Désactiver' : 'Activer'}
						</Button>
					</div>

					<div>
						<h3 className="mb-2 font-medium">Historique des connexions</h3>
						<div className="space-y-2">
							{user.security.loginHistory.map((login) => (
								<div key={`${login.date}-${login.device}`} className="rounded-lg border border-gray-700 p-3">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">{login.device}</p>
											<p className="text-sm text-gray-400">{login.location}</p>
										</div>
										<p className="text-sm text-gray-400">
											{new Date(login.date).toLocaleDateString()} {new Date(login.date).toLocaleTimeString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Abonnement */}
			<Card className="space-y-6">
				<h2 className="text-xl font-bold">Abonnement</h2>
				<div className="rounded-lg border border-gray-700 p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium">Plan {user.subscription.plan}</h3>
							<p className="text-sm text-gray-400">
								Statut: {user.subscription.status}
								{user.subscription.expiresAt && (
									<>
										{' '}
										- Expire le {new Date(user.subscription.expiresAt).toLocaleDateString()}
									</>
								)}
								{user.subscription.paymentMethod && (
									<p className="mt-2 text-sm text-gray-400">
										Méthode de paiement: {user.subscription.paymentMethod.type === 'card' ? 'Carte' : 'PayPal'}
										{user.subscription.paymentMethod.last4 && ` (****${user.subscription.paymentMethod.last4})`}
										{user.subscription.paymentMethod.expiryDate && ` - Expire ${user.subscription.paymentMethod.expiryDate}`}
									</p>
								)}
							</p>
						</div>
						<div className="space-y-2">
							<Button variant="outline" size="sm">
								Gérer l'abonnement
							</Button>
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="autoRenew"
									checked={user.subscription.autoRenew}
									onChange={(e) =>
										setUser({
											...user,
											subscription: { ...user.subscription, autoRenew: e.target.checked },
										})}
									className="h-4 w-4 rounded border-gray-700 bg-gray-800"
								/>
								<label htmlFor="autoRenew" className="text-sm">Renouvellement automatique</label>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* Bouton de sauvegarde */}
			<div className="flex justify-end">
				<Button onClick={handleSave} loading={isSaving} icon={<Save className="h-4 w-4" />}>
					Enregistrer les modifications
				</Button>
			</div>
		</div>
	);
}