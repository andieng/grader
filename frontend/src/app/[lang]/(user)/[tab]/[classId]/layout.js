import SidebarHeader from '@/components/SidebarHeader';
import { getSession, getAccessToken } from '@auth0/nextjs-auth0';

const ClassDetailsLayout = ({ children, params: { lang } }) => {
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
      {children}
    </SidebarHeader>
  );
};

export default ClassDetailsLayout;

// export const metadata = {
//   title: 'Ces | Grader',
//   description: 'Grader - Grade Management App',
//   icons: {
//     icon: '/icon-64x64.png',
//   },
// };

export async function generateMetadata({ params }) {
  const { classId } = params;
  const { accessToken } = await getAccessToken();

  const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/details`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return {
    title: `${data.className} | Grader`,
    description: `${data.className} | Grader`,
    icons: {
      icon: '/icon-64x64.png',
    },
  };
}
