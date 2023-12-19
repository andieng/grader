import SidebarHeader from '@/components/SidebarHeader';
import { getSession, getAccessToken } from '@auth0/nextjs-auth0';

export async function generateMetadata({ params }) {
  const { classId } = params;
  let accessToken;
  try {
    accessToken = (await getAccessToken())?.accessToken;
  } catch (err) {
    return {
      title: 'Grader',
      description: 'Grader',
      icons: {
        icon: '/icon-64x64.png',
      },
    };
  }

  const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/details`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!data.className) {
    return {
      title: 'Grader',
      description: 'Grader',
      icons: {
        icon: '/icon-64x64.png',
      },
    };
  }

  return {
    title: `${data.className} | Grader`,
    description: `${data.className} | Grader`,
    icons: {
      icon: '/icon-64x64.png',
    },
  };
}

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
