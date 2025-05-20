import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAccessToken } from '@/lib/TwitterOAuth';


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    // Get stored state and code verifier from cookies
    const cookieStore = await cookies();
    const storedState = cookieStore.get('twitter_oauth_state')?.value;
    const codeVerifier = cookieStore.get('twitter_code_verifier')?.value;
    
    // Verify state to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
      console.error('Invalid state parameter', { state, storedState });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?twitter_error=invalid_state`);
    }
    
    if (!code || !codeVerifier) {
      console.error('Missing required parameters', { code: !!code, codeVerifier: !!codeVerifier });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?twitter_error=missing_params`);
    }
    
    // Exchange code for access token
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;
    const tokenData = await getAccessToken(code, redirectUri, codeVerifier);
    
    console.log('Received token data:', { 
      access_token_length: tokenData.access_token?.length,
      expires_in: tokenData.expires_in,
      has_refresh: !!tokenData.refresh_token
    });
    
    // Store the tokens securely
    cookieStore.set('twitter_access_token', tokenData.access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in, 
      path: '/',
    });
    
    if (tokenData.refresh_token) {
      cookieStore.set('twitter_refresh_token', tokenData.refresh_token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }
    
    // Clear the state and code verifier cookies
    cookieStore.delete('twitter_oauth_state');
    cookieStore.delete('twitter_code_verifier');
    
    // Get the redirect URL from localStorage or default to dashboard
    const redirectUrl = url.searchParams.get('redirect') || '/dashboard?twitter_connected=true';
    
    // Redirect back to the app with success parameter
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${redirectUrl}`);
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?twitter_error=true`);
  }
}