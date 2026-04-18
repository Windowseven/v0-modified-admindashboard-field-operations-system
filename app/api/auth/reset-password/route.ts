import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('[Mock API] Reset password request:', body);

  return NextResponse.json({
    message: 'Password reset successful. You can now log in.',
  });
}
