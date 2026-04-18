import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('[Mock API] Register request:', body);

  return NextResponse.json({
    message: 'Registration successful. OTP sent to email.',
    email: body.email,
    userId: 'usr_' + Math.random().toString(36).substr(2, 9),
  });
}
