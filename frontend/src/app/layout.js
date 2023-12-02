import '@/styles/globals.scss';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { UserProvider } from '@auth0/nextjs-auth0/client';

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
      <UserProvider>
        <body>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </body>
      </UserProvider>
    </html>
  );
}
