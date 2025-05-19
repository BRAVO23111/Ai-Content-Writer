import { NextResponse } from "next/server";
import { postTweet } from "@/lib/twitteroauth";
import { cookies } from 'next/headers';

interface TwitterContentRequest {
  content: string;
}

export async function POST(request: Request) {
  try {
    const body: TwitterContentRequest = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('twitter_access_token')?.value;
    
    if (!accessToken) {
      // Return a specific response for authentication required
      return NextResponse.json(
        { 
          message: "Twitter authentication required", 
          authUrl: "/api/auth/twitter",
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    console.log('Posting tweet with content:', content);
    
    // Post the tweet using OAuth 2.0
    const data = await postTweet(content, accessToken);

    return NextResponse.json(
      { message: "Content posted to Twitter", tweet: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error posting to Twitter:", error);
    
    // Check if the error is due to an expired token
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { 
          message: "Twitter authentication expired", 
          authUrl: "/api/auth/twitter",
          requiresAuth: true
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Error posting to Twitter", 
        error: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}