import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  console.log('[Mock API] Login request:', { email });

  // Mock successful login for any email/password during prototype phase
  return NextResponse.json({
    user: {
      id: 'usr_1',
      name: 'System Admin',
      email: email || 'admin@fieldsync.io',
      role: 'admin',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    token: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresIn: 3600, // 1 hour
  });
}
