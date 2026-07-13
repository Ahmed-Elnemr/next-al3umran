import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ success: true });

  res.cookies.set('token', '', {
    path: '/',
    expires: new Date(0), 
  });
  res.cookies.set('client_type', '', {
    path: '/',
    expires: new Date(0), 
  });
  res.cookies.set('userDataInfo', '', {
    path: '/',
    expires: new Date(0), 
  });
  res.cookies.set('userId', '', {
    path: '/',
    expires: new Date(0), 
  });

  return res;
}
