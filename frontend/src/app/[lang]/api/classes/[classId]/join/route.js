import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const POST = async function joinClass(req) {
  try {
    const { accessToken } = await getAccessToken();

    const reqData = await req.json();
    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/join`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: reqData.token,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
