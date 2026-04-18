import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('[Mock API] Resend OTP request:', body);

  return NextResponse.json({
    message: 'A new OTP has been sent to ' + body.email,
  });
}
