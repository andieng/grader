import SidebarHeader from '@/components/SidebarHeader';

export default function DashboardLayout({ children, params: { lang } }) {
  return (
    <SidebarHeader
      lang={lang}
      children={children}
    />
  );
}

export const metadata = {
  title: 'Classes | Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};
