import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getStudentMapping(req) {
  try {
    const { accessToken } = await getAccessToken();
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];
    const studentIdIndex = urlParts.indexOf('student-mapping') + 1;
    const studentId = urlParts[studentIdIndex];

    const apiUrl = `${process.env.API_BASE_URL}/api/classes/${classId}/student-mapping/${studentId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};

export const POST = async function mapStudent(req) {
  try {
    const { accessToken } = await getAccessToken();
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];
    const studentIdIndex = urlParts.indexOf('student-mapping') + 1;
    const studentId = urlParts[studentIdIndex];

    const apiUrl = `${process.env.API_BASE_URL}/api/classes/${classId}/student-mapping/${studentId}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};
