import { ERROR_NOT_AUTHENTICATED } from '@/constants/messages';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function profileGetRoute(req) {
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: ERROR_NOT_AUTHENTICATED }, { status: 401 });
  }

  const response = await fetch(`${process.env.API_BASE_URL}/api/user`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return NextResponse.json({ user: data.user });
};
