export default function ClassesLayout({ children }) {
  return <>{children}</>;
}

export const metadata = {
  title: 'Admin Classes | Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};

export const dynamic = 'force-dynamic';
