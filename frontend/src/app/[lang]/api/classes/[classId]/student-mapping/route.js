import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getStudentMapping(req) {
  try {
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const { accessToken } = await getAccessToken();
    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/student-mapping`, {
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

export const POST = async function upsertStudentMapping(req) {
  try {
    const { accessToken } = await getAccessToken();
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const formData = await req.formData();

    const uploadUrl = `${process.env.API_BASE_URL}/api/classes/${classId}/student-mapping`;

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
