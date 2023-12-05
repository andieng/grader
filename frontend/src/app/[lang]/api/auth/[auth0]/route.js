import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      ui_locales: 'vi',
    },
    returnTo: '/',
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
      ui_locales: 'vi',
    },
    returnTo: '/',
  }),
});
