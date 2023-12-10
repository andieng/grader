import SidebarHeader from '@/components/SidebarHeader';

export default function DashboardLayout({ children, params: { lang } }) {
  return (
    <SidebarHeader
      lang={lang}
      children={children}
      isInDashboard={true}
    />
  );
}

export const metadata = {
  title: 'Dashboard | Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};
