import ClassMenu from '@/components/ClassMenu';
import SidebarHeader from '@/components/SidebarHeader';
import { getSession } from '@auth0/nextjs-auth0';

const ClassDetailLayout = ({ children, params: { lang } }) => {
  const hasUser = async () => {
    const session = await getSession();
    if (session?.user) return true;
    return false;
  };

  return (
    <SidebarHeader
      lang={lang}
      isLoggedIn={hasUser()}
    >
      <ClassMenu
        lang={lang}
        isLoggedIn={hasUser()}
      >
        {children}
      </ClassMenu>
    </SidebarHeader>
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
