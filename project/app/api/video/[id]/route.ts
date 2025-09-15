import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // For demo purposes, we'll serve a placeholder video
    // In a real app, you'd fetch the video from your database/storage
    
    // Try to serve a video file from public/videos directory
    const videoPath = join(process.cwd(), 'public', 'videos', `${id}.mp4`);
    
    try {
      const videoBuffer = await readFile(videoPath);
      
      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': videoBuffer.length.toString(),
          'Accept-Ranges': 'bytes',
        },
      });
    } catch (fileError) {
      // If specific video not found, return a placeholder response
      return NextResponse.json(
        { error: 'Video not found', id },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error serving video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}