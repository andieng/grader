import SidebarHeader from '@/components/SidebarHeader';

export default function DashboardLayout({ children, params: { lang } }) {
  return (
    <SidebarHeader
      lang={lang}
      isInDashboard={true}
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
