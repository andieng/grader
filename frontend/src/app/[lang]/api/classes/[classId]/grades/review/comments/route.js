import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getComments(req) {
  try {
    const { accessToken } = await getAccessToken();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/grade-reviews`, {
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

export const POST = async function comment(req) {
  try {
    const { accessToken } = await getAccessToken();
    const reqData = await req.json();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/classes/${classId}/grade-reviews/${reqData.gradeReviewId}/grade-review-comments`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: reqData.content,
        }),
      },
    );

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
