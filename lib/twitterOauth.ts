// Twitter OAuth 2.0 implementation
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { TwitterApi } from 'twitter-api-v2';

// Constants for OAuth 2.0
const TWITTER_OAUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

// Validate environment variables
function validateEnvVariables() {
  const requiredVars = ['TWITTER_CLIENT_ID'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
}

// Generate a random string for code verifier
function generateCodeVerifier(length: number = 64): string {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .slice(0, length);
}

// Generate code challenge from verifier using S256 method
function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Function to generate the OAuth 2.0 authorization URL
export function getAuthorizationUrl(redirectUri: string, state: string) {
  // Validate environment variables
  if (!validateEnvVariables()) {
    throw new Error('Missing required environment variables for Twitter OAuth');
  }
  
  // Generate a code verifier
  const codeVerifier = generateCodeVerifier(64);
  
  // Generate a code challenge from the verifier
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  const url = new URL(TWITTER_OAUTH_URL);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', process.env.TWITTER_CLIENT_ID || '');
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
  url.searchParams.append('state', state);
  url.searchParams.append('code_challenge', codeChallenge);
  url.searchParams.append('code_challenge_method', 'S256');

  return {
    url: url.toString(),
    codeVerifier: codeVerifier
  };
}

// Function to exchange authorization code for access token
export async function getAccessToken(code: string, redirectUri: string, codeVerifier: string) {
  try {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Twitter client credentials are not configured');
    }
    
    // Create the Basic Auth header
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri,
        'code_verifier': codeVerifier
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twitter token error:', errorData);
      throw new Error(`Failed to get access token: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
}

// Function to post a tweet using OAuth 2.0
export async function postTweet(content: string, accessToken: string) {
  try {
    if (!accessToken) {
      throw new Error('Access token is required to post a tweet');
    }
    
    // Create a client with the user's access token
    const userClient = new TwitterApi(accessToken);
    
    // Get the v2 client
    const v2Client = userClient.v2;
    
    // Post the tweet
    const result = await v2Client.tweet(content);
    
    if (!result || !result.data) {
      throw new Error('Failed to post tweet: No data returned from Twitter API');
    }
    
    return result;
  } catch (error: any) {
    console.error('Error posting tweet:', error);
    // Provide more detailed error information
    throw new Error(`Failed to post tweet: ${error.message || 'Unknown error'}`);
  }
}

// Function to refresh an access token
export async function refreshAccessToken(refreshToken: string) {
  try {
    // Validate environment variables
    if (!validateEnvVariables()) {
      throw new Error('Missing required environment variables for Twitter OAuth');
    }
    
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    
    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');
    params.append('client_id', process.env.TWITTER_CLIENT_ID || '');

    const response = await fetch(TWITTER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twitter token refresh error:', errorData);
      throw new Error(`Failed to refresh access token: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}