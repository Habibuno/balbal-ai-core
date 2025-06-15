import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

function DeploymentGuidePage() {
	const [activeTab, setActiveTab] = useState<'apple' | 'android'>('apple');
	const navigate = useNavigate();

	const appleGuide = `# Apple App Store Deployment Guide

## Prerequisites
- Apple Developer Account ($99/year)
- Xcode installed on your Mac
- App Store Connect access
- App icons and screenshots
- Privacy policy and app description

## Steps
1. Prepare your app
   - Configure app signing
   - Set up certificates and provisioning profiles
   - Update version and build numbers

2. Archive your app
   - Select "Any iOS Device" as build target
   - Choose Product > Archive
   - Validate the archive

3. Submit to App Store
   - Upload through Xcode or App Store Connect
   - Fill in app metadata
   - Submit for review

## Review Process
- Typically takes 24-48 hours
- Common rejection reasons:
  - Missing privacy policy
  - Incomplete metadata
  - Technical issues
  - Guideline violations`;

	const androidGuide = `# Google Play Store Deployment Guide

## Prerequisites
- Google Play Developer Account ($25 one-time fee)
- Android Studio
- App signing key
- Privacy policy
- App icons and screenshots

## Steps
1. Prepare your app
   - Generate signed APK/Bundle
   - Configure app signing
   - Update version codes

2. Create release
   - Build release version
   - Test on multiple devices
   - Prepare store listing

3. Submit to Play Store
   - Create new release
   - Upload APK/Bundle
   - Fill in store listing
   - Submit for review

## Review Process
- Usually takes 2-7 days
- Common rejection reasons:
  - Policy violations
  - Technical issues
  - Incomplete information
  - Security concerns`;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-8 text-3xl font-bold">Deployment Guide</h1>

			<div className="mb-6 flex space-x-4">
				<Button variant="outline" onClick={() => navigate('/create')}>
					Go to Editor
				</Button>
				<Button
					variant={activeTab === 'apple' ? 'primary' : 'outline'}
					onClick={() => setActiveTab('apple')}
				>
					Apple App Store
				</Button>
				<Button
					variant={activeTab === 'android' ? 'primary' : 'outline'}
					onClick={() => setActiveTab('android')}
				>
					Google Play Store
				</Button>
			</div>

			<Card className="p-6">
				<div className="prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 max-w-none">
					{activeTab === 'apple' ? (
						<ReactMarkdown>{appleGuide}</ReactMarkdown>
					) : (
						<ReactMarkdown>{androidGuide}</ReactMarkdown>
					)}
				</div>
			</Card>
		</div>
	);
}

export default DeploymentGuidePage;