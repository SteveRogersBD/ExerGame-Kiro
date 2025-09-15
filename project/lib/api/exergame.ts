import { ApiError, HOMEWORK_STATUS_MAP, HomeworkStatusKey } from './types';

// API service for Exergame backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Types based on OpenAPI schema
export interface Question {
  id: number;
  question: string;
  optA: string;
  optB: string;
  optC: string;
  timeToStop: number; // timestamp in seconds when to pause video
  correctAnswer?: string; // A, B, or C
}

export interface Video {
  id: number;
  title: string;
  url: string;
  createdAt: string;
  questions?: Question[]; // Array of questions with timestamps
}

export interface Homework {
  id: number;
  title: string;
  status: string;
  thumbnail?: string;
  videoId?: number;
}

export interface HomeworkWithVideo extends Homework {
  video?: Video;
}

// Helper function to handle API errors
function handleApiError(error: any, context: string): never {
  const apiError: ApiError = {
    message: error.message || `Failed to ${context}`,
    status: error.status,
    code: error.code
  };
  throw apiError;
}

// API functions
export const exergameAPI = {
  // Get all videos
  async getAllVideos(): Promise<Video[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/video`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch videos'}`);
      }

      const videos = await response.json();
      return Array.isArray(videos) ? videos : [];
    } catch (error) {
      console.error('Error fetching videos:', error);
      handleApiError(error, 'fetch videos');
    }
  },

  // Get video by ID
  async getVideoById(videoId: number): Promise<Video | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/video/${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Video ${videoId} not found`);
          return null;
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch video'}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching video ${videoId}:`, error);
      return null; // Return null instead of throwing to allow graceful degradation
    }
  },

  // Get all homework for a child
  async getChildHomework(childId: number): Promise<Homework[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/homework/child/${childId}/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch homework'}`);
      }

      const homework = await response.json();

      // Normalize homework status values
      const normalizedHomework = Array.isArray(homework) ? homework.map(hw => ({
        ...hw,
        status: HOMEWORK_STATUS_MAP[hw.status as HomeworkStatusKey] || hw.status
      })) : [];

      console.log('Fetched homework with thumbnails:', normalizedHomework);
      return normalizedHomework;
    } catch (error) {
      console.error('Error fetching homework:', error);
      handleApiError(error, 'fetch homework');
    }
  },
};