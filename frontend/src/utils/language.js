import enDictionary from '@/dictionaries/en';
import viDictionary from '@/dictionaries/vi';

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'vi'],
};

export const Locale = i18n.locales;

const dictionaries = {
  en: () => enDictionary,
  vi: () => viDictionary,
};
export const getDictionary = (locale) => dictionaries[locale]();
