import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse();
  const { user } = await getSession(req, res);
  const response = await fetch('https://resilient-trifle-81b5eb.netlify.app/api/user');

  // if (!response.ok) {
  // }

  // const resData = await response.json();
  // console.log(resData);

  return NextResponse.json({ user }, res);
});
