import { getAccessToken } from '@auth0/nextjs-auth0';
import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const GET = async function getAssignments(req) {
  try {
    const { accessToken } = await getAccessToken();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/assignments`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};

export const POST = async function createAssignment(req) {
  try {
    const { accessToken } = await getAccessToken();

    const reqData = await req.json();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/assignments`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentName: reqData.assName,
        assignmentGradeScale: reqData.scale,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};

export const PUT = async function createAssignment(req) {
  try {
    const { accessToken } = await getAccessToken();

    const reqData = await req.json();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/assignments`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentName: reqData.assName,
        assignmentGradeScale: reqData.scale,
        isPublished: reqData.isPublished,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};

export const DELETE = async function createAssignment(req) {
  try {
    const { accessToken } = await getAccessToken();

    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const assignmentIndex = urlParts.indexOf('assignments') + 1;
    const classId = urlParts[classIdIndex];
    const assignmentId = urlParts[assignmentIndex];

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/assignments/${assignmentId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
