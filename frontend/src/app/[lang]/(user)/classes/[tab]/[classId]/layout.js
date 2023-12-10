import ClassMenu from '@/components/ClassMenu';

const ClassDetailLayout = ({ children, params: { lang } }) => {
  return (
    <ClassMenu
      lang={lang}
      children={children}
    />
  );
};

export default ClassDetailLayout;

export const metadata = {
  title: 'Classes | Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};
