import { getAccessToken } from '@auth0/nextjs-auth0';
import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const GET = async function getMembers(req) {
  try {
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const { accessToken } = await getAccessToken();
    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/members`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
};

export const POST = async function addMember(req) {
  try {
    const { accessToken } = await getAccessToken();

    const reqData = await req.json();
    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${reqData.classId}/members`, {
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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 404 });
  }
};
