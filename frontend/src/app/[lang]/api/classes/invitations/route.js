import { getAccessToken } from '@auth0/nextjs-auth0';
import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const POST = async function inviteMember(req) {
  try {
    const { accessToken } = await getAccessToken();

    const reqData = await req.json();

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${reqData.classId}/invitations`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `${process.env.AUTH0_BASE_URL}/d`,
        emails: [reqData.email],
        role: reqData.role,
        lang: 'en',
      }),
    });

    const data = await response.json();
    console.log(data);

    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
