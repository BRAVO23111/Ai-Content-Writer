import { NextResponse } from 'next/server';
import db from '@/lib/prismadb';

export async function PUT(request: Request) {
  try {
    const { id, title, body } = await request.json();
    
    if (!id || !title || !body) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Find the content first to verify ownership
    const existingContent = await db.content.findUnique({
      where: { id }
    });
    
    if (!existingContent) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content not found' 
      }, { status: 404 });
    }
    
    // Update the content
    const updatedContent = await db.content.update({
      where: { id },
      data: { title, body }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedContent 
    });
    
  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update content' 
    }, { status: 500 });
  }
}