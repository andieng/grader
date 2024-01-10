import { getAccessToken } from '@auth0/nextjs-auth0';
import chalk from 'chalk';
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
    console.log(chalk.bgRed('-------------------------------'));
    const urlParts = req.nextUrl.pathname.split('/');
    const classIdIndex = urlParts.indexOf('classes') + 1;
    const classId = urlParts[classIdIndex];

    // const formData = await req.nextRequest.formData();
    // console.log(req);
    const formData = await req.json();
    console.log(formData);
    console.log(chalk.bgYellow('-------------------------------'));

    // const formDataObj = await formData;
    const file = formData.get('file');

    console.log(file);

    const uploadUrl = `${process.env.API_BASE_URL}/api/classes/${classId}/grades/upload`;

    // const response = await fetch(uploadUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     authorization: `Bearer ${accessToken}`,
    //   },
    //   body: file,
    // });

    // const data = await response.json();
    // console.log(chalk.bgCyan('-----------------------------'));
    // console.log(data);
    // return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
