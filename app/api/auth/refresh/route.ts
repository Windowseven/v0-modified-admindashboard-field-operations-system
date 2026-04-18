import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { refreshToken } = body;

  console.log('[Mock API] Refresh request');

  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token required' }, { status: 400 });
  }

  return NextResponse.json({
    token: 'mock_access_token_refreshed_' + Date.now(),
    expiresIn: 3600,
  });
}
