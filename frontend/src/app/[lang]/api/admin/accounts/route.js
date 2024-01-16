import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getAccounts(req) {
  try {
    const { accessToken } = await getAccessToken();

    const response = await fetch(`${process.env.API_BASE_URL}/api/admin/accounts`, {
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

export const PUT = async function editUser(req) {
  try {
    const { accessToken } = await getAccessToken();
    const reqData = await req.json();

    const response = await fetch(`${process.env.API_BASE_URL}/api/admin/accounts/${reqData.userId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: reqData.role,
        isBanned: reqData.isBanned,
        studentId: reqData.studentId,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
