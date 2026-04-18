import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('[Mock API] Forgot password request:', body);

  // Return success even if email not found to prevent enumeration
  return NextResponse.json({
    message: 'If an account exists for this email, a reset code will be sent.',
  });
}
