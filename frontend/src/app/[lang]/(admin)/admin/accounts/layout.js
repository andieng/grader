import AdminSideBar from '@/components/AdminSideBar';
import SidebarHeader from '@/components/SidebarHeader';
import { getSession } from '@auth0/nextjs-auth0';

export default function AccountsLayout({ children }) {
  return <>{children}</>;
}

export const metadata = {
  title: 'Admin Accounts | Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};

export const dynamic = 'force-dynamic';
