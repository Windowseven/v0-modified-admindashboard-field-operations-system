import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('[Mock API] Verify OTP request:', body);

  return NextResponse.json({
    message: 'Verification successful',
    resetToken: body.context === 'password_reset' ? 'mock_reset_token_' + Date.now() : undefined,
  });
}
