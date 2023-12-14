import SidebarHeader from '@/components/SidebarHeader';
import { getSession } from '@auth0/nextjs-auth0';

export default function DashboardLayout({ children, params: { lang } }) {
  const hasUser = async () => {
    const session = await getSession();
    if (session?.user) return true;
    return false;
  };

  // let isLogin = false;

  // hasUser().then((hasUser) => {
  //   console.log(hasUser);
  //   isLogin = hasUser;
  // });

  return (
    <SidebarHeader
      lang={lang}
      isInDashboard={true}
      isLoggedIn={hasUser()}
    >
      {children}
    </SidebarHeader>
  );
}

export const metadata = {
  title: 'Dashboard | Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};
