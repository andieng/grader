import ClassMenu from '@/components/ClassMenu';
import SidebarHeader from '@/components/SidebarHeader';

const ClassDetailLayout = ({ children, params: { lang } }) => {
  return (
    <>
      <SidebarHeader
        lang={lang}
        children={<ClassMenu lang={lang}>{children}</ClassMenu>}
      />
    </>
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
