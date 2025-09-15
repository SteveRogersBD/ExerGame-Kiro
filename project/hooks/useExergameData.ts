import { useState, useEffect } from 'react';
import { exergameAPI, Video, Homework, HomeworkWithVideo } from '@/lib/api/exergame';
import { ApiError } from '@/lib/api/types';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exergameAPI.getAllVideos();
      setVideos(data);
    } catch (err) {
      const errorMessage = (err as ApiError)?.message || 'Failed to fetch videos';
      setError(errorMessage);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, error, refetch: fetchVideos };
}

export function useChildHomework(childId: number) {
  const [homework, setHomework] = useState<HomeworkWithVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (childId) {
      fetchHomework();
    }
  }, [childId]);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get all homework
      const homeworkData = await exergameAPI.getChildHomework(childId);
      
      // Then, fetch video details for each homework that has a videoId
      const homeworkWithVideos: HomeworkWithVideo[] = await Promise.all(
        homeworkData.map(async (hw) => {
          if (hw.videoId) {
            try {
              const video = await exergameAPI.getVideoById(hw.videoId);
              return { ...hw, video };
            } catch (err) {
              console.warn(`Failed to fetch video ${hw.videoId} for homework ${hw.id}:`, err);
              return hw; // Return homework without video if fetch fails
            }
          }
          return hw; // Return homework as-is if no videoId
        })
      );
      
      console.log('Homework with video details:', homeworkWithVideos);
      setHomework(homeworkWithVideos);
    } catch (err) {
      const errorMessage = (err as ApiError)?.message || 'Failed to fetch homework';
      setError(errorMessage);
      console.error('Error fetching homework:', err);
    } finally {
      setLoading(false);
    }
  };

  return { homework, loading, error, refetch: fetchHomework };
}