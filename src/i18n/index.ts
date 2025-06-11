import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import de from './locales/de.json';
import el from './locales/el.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ms from './locales/ms.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';
import ur from './locales/ur.json';
import zh from './locales/zh.json';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			fr: { translation: fr },
			es: { translation: es },
			pt: { translation: pt },
			de: { translation: de },
			it: { translation: it },
			zh: { translation: zh },
			ja: { translation: ja },
			ko: { translation: ko },
			hi: { translation: hi },
			ur: { translation: ur },
			ar: { translation: ar },
			ms: { translation: ms },
			tr: { translation: tr },
			el: { translation: el },
			uk: { translation: uk },
			ru: { translation: ru },
		},
		fallbackLng: 'en',
		debug: true,
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
