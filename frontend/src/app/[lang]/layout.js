import '@/styles/globals.scss';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ConfigProvider } from 'antd';

export const metadata = {
  title: 'Grader',
  description: 'Grader - Grade Management App',
  icons: {
    icon: '/icon-64x64.png',
  },
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export default function RootLayout({ children, params }) {
  return (
    <html lang={params.lang}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#3ac5c9',
          },
          components: {
            Menu: {
              colorPrimary: '#0bb0b5',
            },
          },
        }}
      >
        <UserProvider>
          <body>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </body>
        </UserProvider>
      </ConfigProvider>
    </html>
  );
}
