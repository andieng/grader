import { getAccessToken } from '@auth0/nextjs-auth0';
import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const GET = async function getMembers(req) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const classId = searchParams.get('classId');

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
    console.log(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
};

export const POST = async function addMember(req) {
  try {
    const { accessToken } = await getAccessToken();

    const reqData = await req.json();

    console.log(reqData);

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
    console.log(chalk.red('daat'), data);

    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
