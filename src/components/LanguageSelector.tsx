import { Menu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';
import { ChevronDown, Globe } from 'lucide-react';
import type React from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/Button';

const languages = [
	{ code: 'en', name: 'English' },
	{ code: 'fr', name: 'Français' },
	{ code: 'es', name: 'Español' },
	{ code: 'pt', name: 'Português' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'it', name: 'Italiano' },
	{ code: 'zh', name: '中文' },
	{ code: 'ja', name: '日本語' },
	{ code: 'ko', name: '한국어' },
	{ code: 'hi', name: 'हिन्दी' },
	{ code: 'ur', name: 'اردو' },
	{ code: 'ar', name: 'العربية' },
	{ code: 'ms', name: 'Bahasa Melayu' },
	{ code: 'tr', name: 'Türkçe' },
	{ code: 'el', name: 'Ελληνικά' },
	{ code: 'uk', name: 'Українська' },
	{ code: 'ru', name: 'Русский' },
];

export const LanguageSelector: React.FC = () => {
	const { i18n } = useTranslation();

	const handleLanguageChange = (langCode: string) => {
		i18n.changeLanguage(langCode);
		window.location.reload();
	};

	return (
		<Menu as="div" className="relative z-50 inline-block text-left">
			<Menu.Button className="inline-flex items-center gap-2 rounded-md border-2 border-cyan-400/20 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none">
				<Globe className="h-5 w-5" />
				<span>{languages.find((lang) => lang.code === i18n.language)?.name || 'English'}</span>
				<ChevronDown className="h-4 w-4" />
			</Menu.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-cyan-400/20 rounded-md border-2 border-cyan-400/20 bg-black shadow-lg focus:outline-none">
					{languages.map((lang) => (
						<div key={lang.code} className="px-1 py-1">
							<Menu.Item>
								{({ active }) => (
									<Button
										className={clsx(
											'group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors',
											active ? 'bg-cyan-400/20 text-white' : 'text-gray-300'
										)}
										onClick={() => handleLanguageChange(lang.code)}
									>
										{lang.name}
									</Button>
								)}
							</Menu.Item>
						</div>
					))}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};
