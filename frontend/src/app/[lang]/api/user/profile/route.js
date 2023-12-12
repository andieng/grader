import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function profileGetRoute(req) {
  try {
    const { accessToken } = await getAccessToken();

    const response = await fetch(`${process.env.API_BASE_URL}/api/user`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
