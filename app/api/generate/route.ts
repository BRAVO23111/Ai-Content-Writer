import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cookies } from 'next/headers';
import db from "@/app/lib/prismadb";

// Define content types and their requirements
interface ContentRequest {
  platform: 'instagram' | 'linkedin' | 'twitter';
  topic: string;
  keywords: string[];
  tone?: string;
  autoPost?: boolean;
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(request: Request) {
  try {
    const body: ContentRequest = await request.json();
    const { platform, topic, keywords, tone = 'professional', autoPost = false } = body;

    // Platform-specific prompts
    const prompts = {
      instagram: `Create an engaging Instagram post about ${topic}. Include relevant hashtags. 
                 Make it visually descriptive and emotionally appealing. 
                 Optimize for these keywords: ${keywords.join(', ')}. 
                 Tone should be ${tone}.`,
      linkedin: `Write a professional LinkedIn post about ${topic}. 
                Focus on business value and industry insights. 
                Include these keywords for SEO: ${keywords.join(', ')}. 
                Maintain a ${tone} tone.`,
      twitter: `Create a concise Twitter post (max 280 chars) about ${topic}. 
               Make it engaging and shareable. 
               Incorporate these keywords naturally: ${keywords.join(', ')}. 
               Use a ${tone} tone.`
    };

    // Generate content using Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `You are a professional social media content creator. ${prompts[platform]}` }],
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: platform === 'twitter' ? 100 : 300,
      },
    });

    const response =  result.response;
    let processedContent = response.text();
    
    // Post-process the content based on platform requirements
    if (platform === 'twitter' && processedContent.length > 280) {
      processedContent = processedContent.substring(0, 277) + '...';
    }

    // Add SEO optimization
    const seoOptimized = {
      content: processedContent,
      keywords: keywords,
      platform: platform,
      metadata: {
        contentLength: processedContent.length,
        keywordDensity: calculateKeywordDensity(processedContent, keywords),
        readabilityScore: calculateReadabilityScore(processedContent)
      }
    };

    // If it's Twitter content and autoPost is enabled, post directly to Twitter
    if (platform === 'twitter' && autoPost) {
      try {
        // Use the absolute URL with your domain
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const twitterResponse = await fetch(`${baseUrl}/api/twitter/postContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: processedContent,
          }),
        });
        
        // Handle response safely
        let twitterData;
        try {
          const text = await twitterResponse.text();
          console.log('Twitter response text:', text);
          if(text){
            try {
              twitterData = JSON.parse(text);
              console.log('Parsed Twitter response:', twitterData);
            } catch (error) {
              console.warn('Error parsing Twitter response:', error);
              twitterData = { error: 'Invalid response from Twitter API' };
            }
          }
        } catch (parseError) {
          console.error('Error parsing Twitter response:', parseError);
          twitterData = { error: 'Invalid response from Twitter API' };
        }
        
        // Check if authentication is required
        if (twitterData && twitterData.requiresAuth) {
          return NextResponse.json({
            success: true,
            data: seoOptimized,
            twitter: {
              posted: false,
              requiresAuth: true,
              authUrl: twitterData.authUrl || '/api/auth/twitter'
            }
          });
        }
        
        if (!twitterResponse.ok) {
          console.error('Error posting to Twitter:', twitterData);
          return NextResponse.json({
            success: true,
            data: seoOptimized,
            twitter: {
              posted: false,
              error: twitterData.message || twitterData.error || `Failed to post to Twitter (${twitterResponse.status})`
            }
          });
        }
        
        return NextResponse.json({
          success: true,
          data: seoOptimized,
          twitter: {
            posted: true,
            tweet: twitterData
          }
        });
      } catch (twitterError) {
        console.error('Twitter posting error:', twitterError);
        return NextResponse.json({
          success: true,
          data: seoOptimized,
          twitter: {
            posted: false,
            error: 'Failed to post to Twitter'
          }
        });
      }
    }

    // Get user from session token
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized - No session token' }, { status: 401 });
    }
    const user = await db.user.findUnique({ where: { id: sessionToken.value } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 });
    }
    // Save content to DB
    const savedContent = await db.content.create({
      data: {
        title: topic,
        body: processedContent,
        userId: user.id,
      },
    });
    return NextResponse.json({ 
      success: true, 
      data: seoOptimized 
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate content' 
    }, { status: 500 });
  }
}

// Helper functions for SEO optimization
function calculateKeywordDensity(content: string, keywords: string[]): number {
  const wordCount = content.toLowerCase().split(/\s+/).length;
  let keywordCount = 0;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'g');
    const matches = content.toLowerCase().match(regex);
    if (matches) {
      keywordCount += matches.length;
    }
  });

  return (keywordCount / wordCount) * 100;
}

function calculateReadabilityScore(content: string): number {
  // Simple Flesch-Kincaid readability score implementation
  const sentences = content.split(/[.!?]+/).length;
  const words = content.toLowerCase().split(/\s+/).length;
  const syllables = countSyllables(content);
  
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function countSyllables(text: string): number {
  // Basic syllable counting implementation
  return text.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/[^aeiouy]*[aeiouy]+/g, 'a')
    .length;
}

export async function GET(request:Request) {
    try {
          const cookieStore = await cookies();
          const sessionToken = cookieStore.get('session_token');

          if (!sessionToken) {
            return NextResponse.json(
              { error: 'Unauthorized - No session token' },
              { status: 401 }
            );
          }
          // Fetch all content from the database
          const allContent = await db.content.findMany({
            orderBy: { createdAt: 'desc' },
          });
          return NextResponse.json({
            allContent,
            success: true,
            data: allContent
          });

    } catch (error) {
      console.error('error fetching the content' ,error);
      return NextResponse.json({
        error : 'Failed to fetch content'
      } , {
        status : 500
      })
    }
}