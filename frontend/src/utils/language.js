import enDictionary from '@/dictionaries/en';
import viDictionary from '@/dictionaries/vi';

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'vi'],
};

export const Locale = i18n.locales;

const getDictionary = (locale, path) => {
  switch (locale) {
    case 'en':
      return enDictionary(path);
    case 'vi':
      return viDictionary(path);
  }
};

export default getDictionary;
