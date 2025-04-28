import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Remove Twitter tokens
    cookieStore.delete('twitter_access_token');
    cookieStore.delete('twitter_refresh_token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Twitter:', error);
    return NextResponse.json({ error: 'Failed to disconnect Twitter' }, { status: 500 });
  }
}