import { getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function myApiRoute(req) {
  const res = new NextResponse();
  const { accessToken } = await getAccessToken(req, res);
  const response = await fetch(process.env.API_BASE_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return NextResponse.json({ user: data.user }, res);
};
