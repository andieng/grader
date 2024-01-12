import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getGrades(req) {
  try {
    const { accessToken } = await getAccessToken();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/grades`, {
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

export const POST = async function upsertGrade(req) {
  try {
    const { accessToken } = await getAccessToken();
    const reqData = await req.json();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/grades`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentId: reqData.assignmentId,
        grades: [{ studentId: reqData.studentId, gradeValue: reqData.gradeValue }],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
