import '@/styles/globals.scss';
import StyledComponentsRegistry from '@/lib/AntdRegistry';

export const metadata = {
  title: 'Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
