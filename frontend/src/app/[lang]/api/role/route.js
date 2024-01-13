import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { CLAIM_ROLES } from '@/constants/auth';

export const GET = async function getRole(req) {
  try {
    const session = await getSession();
    if (session?.user[CLAIM_ROLES]?.includes('admin')) {
      return NextResponse.json({ role: 'admin' });
    }

    return NextResponse.json({ role: 'user' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
