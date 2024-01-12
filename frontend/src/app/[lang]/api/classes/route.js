import { DatabaseOutlined } from '@ant-design/icons';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getClasses(req) {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch(`${process.env.API_BASE_URL}/api/classes`, {
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

export const POST = async function createClass(req) {
  try {
    const { accessToken } = await getAccessToken();

    const { className } = await req.json();

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        className,
      }),
    });

    if (!response.ok) {
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
