import { getAccessToken } from '@auth0/nextjs-auth0';
import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const POST = async function createClass(req) {
  try {
    const { accessToken } = await getAccessToken();

    const { className } = await req.json();
    console.log(chalk.cyan('name'), className.className);

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/create`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        className: className.className,
        url: `${process.env.AUTH0_BASE_URL}/d`,
      }),
    });

    if (!response.ok) {
    }

    // console.log(chalk.bgRed('response'), response);
    const data = await response.json();
    console.log(chalk.bgCyan('data'), data);

    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
