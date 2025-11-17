import { translations, TranslationKey } from './translations';

type SupportedLangs = 'ru' | 'en' | 'he';

export const useTranslations = () => {
  const getLanguage = (): SupportedLangs => {
    const lang = navigator.language.split('-')[0];
    if (lang === 'ru' || lang === 'en' || lang === 'he') {
      return lang;
    }
    return 'en'; // Default language
  };

  const lang = getLanguage();
  const langPack = translations[lang];

  const t = (key: TranslationKey): string => {
    return langPack[key] || translations['en'][key] || key;
  };

  return { t, lang };
};
