const dictionaries = {
  en: async () => {
    const Header = import('./en/components/Header.lang.json').then((module) => module.default);
    // const pageHome = import('./dictionaries/vi/page/home.json').then((module) => module.default);
    // const pageDashboard = import('./dictionaries/vi/page/dashboard.json').then((module) => module.default);

    return {
      component: {
        header: await Header,
      },
      // page: {
      //   home: await pageHome,
      //   dashboard: await pageDashboard,
      // },
    };
  },
  vi: async () => {
    const Header = import('./vi/components/Header.lang.json').then((module) => module.default);
    // const pageHome = import('./dictionaries/vi/page/home.json').then((module) => module.default);
    // const pageDashboard = import('./dictionaries/vi/page/dashboard.json').then((module) => module.default);

    // return {
    //   component: {
    //     header: await componentHeader,
    //   },
    //   page: {
    //     home: await pageHome,
    //     dashboard: await pageDashboard,
    //   },
    // };
  },
};

export const getDictionary = async (locale) => dictionaries[locale]();
