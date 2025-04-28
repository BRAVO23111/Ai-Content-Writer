import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('twitter_access_token')?.value;
    const refreshToken = cookieStore.get('twitter_refresh_token')?.value;
    
    return NextResponse.json({
      authenticated: !!accessToken,
      hasRefreshToken: !!refreshToken
    });
  } catch (error) {
    console.error('Error checking Twitter auth status:', error);
    return NextResponse.json({ error: 'Failed to check authentication status' }, { status: 500 });
  }
}