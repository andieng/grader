import { handleAuth, handleLogin, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

import chalk from 'chalk';

// export const GET = handleAuth({
//   login: handleLogin((req) => {
//     return {
//       returnTo: '/dashboard',
//     };
//   }),
// });

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
    },
    returnTo: '/dashboard',
  }),
});

// import { redirect } from 'next/navigation';

// const login = async () => {
//   console.log(chalk.bgRed('heelo'));
//   const { user } = await getSession(req);
//   console.log(user);
//   return handleAuth({
//     login: handleLogin((req) => {
//       return {
//         returnTo: '/dashboard',
//       };
//     }),
//   });
// };

// export const GET = await login(req);
