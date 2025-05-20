import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getAuthorizationUrl } from '../../../../lib/twitteroauth'

export async function GET() {
  try {
    // Generate a random state to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString('hex');
    
    // Get the redirect URI (must match what's registered in Twitter Developer Portal)
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;
    
    // Get the authorization URL and code verifier
    const { url, codeVerifier } = getAuthorizationUrl(redirectUri, state);
    
    // Store the state and code verifier in cookies
    const cookieStore = await cookies();
    cookieStore.set('twitter_oauth_state', state, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });
    cookieStore.set('twitter_code_verifier', codeVerifier, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });
    
    // Redirect to Twitter's authorization page
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Twitter auth error:', error);
    return NextResponse.json({ error: 'Failed to initiate Twitter authentication' }, { status: 500 });
  }
}