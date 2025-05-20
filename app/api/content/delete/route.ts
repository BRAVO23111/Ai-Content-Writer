import { NextResponse } from 'next/server';
import db from '@/app/lib/prismadb';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content ID is required' 
      }, { status: 400 });
    }
    
    // Find the content first to verify it exists
    const existingContent = await db.content.findUnique({
      where: { id }
    });
    
    if (!existingContent) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content not found' 
      }, { status: 404 });
    }
    
    // Delete the content
    await db.content.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content deleted successfully' 
    });
    
  } catch (error) {
    console.error('Content deletion error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete content' 
    }, { status: 500 });
  }
}