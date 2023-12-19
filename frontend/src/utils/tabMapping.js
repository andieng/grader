export const getTabName = (lang, tab) => {
  switch (tab) {
    case 'd':
      return lang === 'en' ? 'Details' : 'Chi tiết';
    case 'p':
      return lang === 'en' ? 'People' : 'Mọi người';
    case 'g':
      return lang === 'en' ? 'Grades' : 'Điểm';
  }
};
