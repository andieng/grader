import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const POST = async function upsertGrade(req) {
  try {
    const { accessToken } = await getAccessToken();
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const formData = await req.formData();

    const uploadUrl = `${process.env.API_BASE_URL}/api/classes/${classId}/grades/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
