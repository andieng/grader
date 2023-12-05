const dictionaries = {
  en: async () => {
    const enDictionary = await import('./dictionaries/en/index');
    return enDictionary.default;
  },
  vi: async () => {
    const viDictionary = await import('./dictionaries/vi/index');
    return viDictionary.default;
  },
};

export const getDictionary = async (locale) => dictionaries[locale]();
