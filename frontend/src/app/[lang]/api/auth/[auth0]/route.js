import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import URLParse from 'url-parse';

const getLocale = (req) => {
  const parsedUrl = URLParse(req.url, true);
  const pathname = parsedUrl.pathname;
  const language = pathname.split('/')[1];

  return language;
};

const login = async (req, res) => {
  const locale = getLocale(req);

  return handleLogin(req, res, {
    authorizationParams: {
      ui_locales: locale,
    },
    returnTo: `/${locale}`,
  });
};

const signup = async (req, res) => {
  const locale = getLocale(req);

  return handleLogin(req, res, {
    authorizationParams: {
      screen_hint: 'signup',
      ui_locales: locale,
    },
    returnTo: `/${locale}/verify`,
  });
};

const logout = async (req, res) => {
  const locale = getLocale(req);

  return handleLogout(req, res, {
    returnTo: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
  });
};

export const GET = handleAuth({
  login,
  signup,
  logout,
});
