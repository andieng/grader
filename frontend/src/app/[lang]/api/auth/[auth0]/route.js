import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import URLParse from 'url-parse';

const getLocale = (req) => {
  const parsedUrl = URLParse(req.url, true);
  const pathname = parsedUrl.pathname;
  const language = pathname.split('/')[1];

  return language;
};

const login = async (req, res) => {
  return handleLogin(req, res, {
    authorizationParams: {
      ui_locales: getLocale(req),
    },
    returnTo: '/',
  });
};

const signup = async (req, res) => {
  return handleLogin(req, res, {
    authorizationParams: {
      screen_hint: 'signup',
      ui_locales: getLocale(req),
    },
    returnTo: '/',
  });
};

export const GET = handleAuth({
  login,
  signup,
});
