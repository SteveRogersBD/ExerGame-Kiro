"use client";

// app/kids/page.tsx (kids theme: colorful + mascots + emoji bg)
// stack: next.js (app router) + tailwind
// images expected at /public/images: bear.png, eagle.png, monkey.png, penguin.png, happy_tigers.png

import React, { useState } from "react";
import { Play, Book, CheckCircle2, ChevronRight, Trophy, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useVideos, useChildHomework } from "@/hooks/useExergameData";
import { Video, HomeworkWithVideo } from "@/lib/api/exergame";
import { getBestThumbnailUrl, generateHomeworkThumbnailUrl } from "@/lib/utils/thumbnail";
import { ThumbnailImage } from "@/components/ui/ThumbnailImage";

// -----------------------------
// types
// -----------------------------
type VideoItem = Video & {
  thumbnail?: string;
};

type HomeworkStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";

type HomeworkItem = HomeworkWithVideo & {
  status: HomeworkStatus;
  thumbnail?: string;
  type: "video" | "quiz";
  videoUrl?: string;
};

// -----------------------------
// dummy data (replace with api calls later)
// -----------------------------
// const DUMMY_VIDEOS: VideoItem[] = [
//   { id: 1, title: "dora: beach cleanup", url: "/sample/sample1.mp4" },
//   { id: 2, title: "animal moves warmup" },
//   { id: 3, title: "space jumps adventure" },
//   { id: 4, title: "jungle squats" },
// ];

// const DUMMY_HOMEWORK: HomeworkItem[] = [
//   { id: 101, title: "dora episode quiz", status: "NOT_STARTED", type: "video", videoUrl: "/sample/sample1.mp4" },
//   { id: 102, title: "count the seashells", status: "IN_PROGRESS", type: "quiz" },
//   { id: 103, title: "balance basics", status: "DONE", type: "video" },
//   { id: 104, title: "color match", status: "NOT_STARTED", type: "quiz" },
// ];

// -----------------------------
// theme helpers
// -----------------------------
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

function StatusChip({ status }: { status: HomeworkStatus }) {
  const map: Record<HomeworkStatus, { label: string; bg: string; dot: string }> = {
    NOT_STARTED: { label: "not started", bg: "bg-white/70 text-rose-700", dot: "bg-rose-400" },
    IN_PROGRESS: { label: "in progress", bg: "bg-white/70 text-amber-700", dot: "bg-amber-400" },
    DONE: { label: "done", bg: "bg-white/70 text-emerald-700", dot: "bg-emerald-400" },
  };
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs shadow", s.bg)}>
      <span className={cn("h-2 w-2 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="mb-3 mt-2 flex items-center justify-between">
      <h2 className="text-xl font-extrabold text-sky-900 drop-shadow">{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="group inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-900">
          see all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}

function VideoCard({ item, onClick }: { item: VideoItem; onClick: (item: VideoItem) => void }) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group w-64 shrink-0 cursor-pointer select-none rounded-3xl border-2 border-amber-200 bg-white/80 p-3 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300"
      aria-label={`${item.title}`}
    >
      <ThumbnailImage
        src={item.thumbnail}
        alt={`${item.title} thumbnail`}
        title={item.title}
        fallbackGradient="from-pink-300 to-amber-200"
      />
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-amber-300 p-2 shadow"><Play className="h-5 w-5 text-white" /></span>
        <p className="line-clamp-1 text-left text-base font-semibold text-sky-900">{item.title}</p>
      </div>
    </button>
  );
}

function HomeworkCard({ item, onClick }: { item: HomeworkItem; onClick: (item: HomeworkItem) => void }) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group w-64 shrink-0 cursor-pointer select-none rounded-3xl border-2 border-sky-200 bg-white/80 p-3 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300"
      aria-label={`${item.title}`}
    >
      <ThumbnailImage
        src={item.thumbnail}
        alt={`${item.title} thumbnail`}
        title={item.title}
        fallbackGradient="from-sky-300 to-purple-300"
      />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sky-300 p-2 shadow"><Book className="h-5 w-5 text-white" /></span>
          <p className="line-clamp-1 text-left text-base font-semibold text-sky-900">{item.title}</p>
        </div>
      </div>
      <div className="mt-3"><StatusChip status={item.status} /></div>
    </button>
  );
}

function RowScroller({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
      {children}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// New popup with cardTiger
function GameReadyPopup({ open, onClose, onStart }: { open: boolean; onClose: () => void; onStart: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[90vw] max-w-lg rounded-3xl border-4 border-amber-300 bg-gradient-to-b from-sky-100 via-rose-100 to-amber-100 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-sky-600 hover:bg-white hover:text-sky-900 shadow-lg"
        >
          <X className="h-5 w-5" />
        </button>

        {/* CardTiger at the top */}
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cardTiger.png"
            alt="Card Tiger"
            className="mb-4 drop-shadow-lg"
            style={{ width: 200, height: 200 }}
          />

          {/* "Get ready for the game!" message */}
          <div className="mb-6 rounded-2xl border-3 border-amber-400 bg-white/90 px-6 py-4 shadow-lg">
            <h2 className="text-2xl font-black text-amber-800 text-center">Get ready for the game!</h2>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-8 py-4 text-xl font-black text-white shadow-lg hover:from-emerald-500 hover:to-green-600 transform hover:scale-105 transition-all"
          >
            Let's Go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}



// emoji background layer
function EmojiBackground() {
  const emojis = ["⭐", "🌈", "🍎", "🪁", "🧩", "🎈", "🎵", "🍀", "🌟", "🦄"];
  const nodes = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 120; // a bit taller than viewport
    const rotate = Math.random() * 40 - 20;
    const scale = 0.8 + Math.random() * 0.8;
    const emoji = emojis[i % emojis.length];
    return (
      <span
        key={i}
        style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${rotate}deg) scale(${scale})` }}
        className="pointer-events-none absolute select-none opacity-20"
      >
        {emoji}
      </span>
    );
  });
  return <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">{nodes}</div>;
}

// top mascot banner with big "Ready to Play!" card
function MascotBanner() {
  return (
    <div className="relative mb-6 mt-4 flex flex-col items-center justify-center">
      {/* center mascot - bigger tiger */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/happy_tigers.png" alt="tiger" className="mx-auto drop-shadow-lg" style={{ width: 240, height: 240 }} />

      {/* Big "Ready to Play!" card */}
      <div className="mt-4 rounded-3xl border-4 border-amber-300 bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 px-8 py-4 shadow-xl">
        <h1 className="text-4xl font-black text-amber-800 drop-shadow-sm">Ready to Play!</h1>
      </div>
    </div>
  );
}

// side mascots floating (decorative)
function SideMascots() {
  return (
    <>
      {/* penguin moved to top right to avoid homework overlap */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/penguin.png" alt="penguin" className="pointer-events-none absolute right-4 top-20 hidden md:block" style={{ width: 110, height: 110 }} />

      {/* monkey on top left corner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/monkey.png" alt="monkey" className="pointer-events-none absolute left-4 top-32 hidden md:block" style={{ width: 120, height: 120 }} />

      {/* eagle on bottom right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/eagle.png" alt="eagle" className="pointer-events-none absolute bottom-32 right-8 hidden md:block" style={{ width: 120, height: 120 }} />
    </>
  );
}

// -----------------------------
// main page (kids theme)
// -----------------------------
export default function KidsDashboardPage() {
  const childId = 1; // Using childId=1 as requested
  
  // API hooks
  const { videos: apiVideos, loading: videosLoading, error: videosError } = useVideos();
  const { homework: apiHomework, loading: homeworkLoading, error: homeworkError } = useChildHomework(childId);
  
  // Transform API data to match existing component structure
  const videos: VideoItem[] = apiVideos.map(video => ({
    ...video,
    thumbnail: getBestThumbnailUrl(video.url, undefined, video.title)
  }));
  
  const homeworks: HomeworkItem[] = apiHomework.map(hw => {
    // Priority: video URL thumbnail > API thumbnail > fallback
    let thumbnailUrl: string;
    
    if (hw.video?.url) {
      // Use video URL to generate thumbnail (same as preset videos)
      thumbnailUrl = getBestThumbnailUrl(hw.video.url, hw.thumbnail, hw.title);
      console.log(`Homework ${hw.id} (${hw.title}): Using video URL ${hw.video.url} for thumbnail = ${thumbnailUrl}`);
    } else {
      // Fallback to API thumbnail or generated thumbnail
      thumbnailUrl = getBestThumbnailUrl(undefined, hw.thumbnail, hw.title) || generateHomeworkThumbnailUrl(hw.id);
      console.log(`Homework ${hw.id} (${hw.title}): No video URL, using API thumbnail = ${hw.thumbnail}, Final thumbnail = ${thumbnailUrl}`);
    }
    
    return {
      ...hw,
      status: (hw.status as HomeworkStatus) || "NOT_STARTED",
      thumbnail: thumbnailUrl,
      type: "video" as const,
      videoUrl: hw.video?.url || `/homework/${hw.id}/video.mp4` // Use actual video URL or fallback
    };
  });
  
  const [showGameReadyPopup, setShowGameReadyPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VideoItem | HomeworkItem | null>(null);

  const router = useRouter();
  const kidName = "mika"; // replace with real kid profile

  const handlePlayVideo = (item: VideoItem) => {
    setSelectedItem(item);
    setShowGameReadyPopup(true);
  };

  const handleOpenHomework = (item: HomeworkItem) => {
    setSelectedItem(item);
    setShowGameReadyPopup(true);
  };

  const handleStartGame = () => {
    setShowGameReadyPopup(false);
    // Redirect to game page with item info
    if (selectedItem) {
      const itemType = 'type' in selectedItem ? 'homework' : 'video';
      router.push(`/game?type=${itemType}&id=${selectedItem.id}&title=${encodeURIComponent(selectedItem.title)}`);
    }
  };

  const markHomeworkProgress = (id: number, next: HomeworkStatus) => {
    // Note: This would need to be implemented with an API call to update homework status
    console.log(`Marking homework ${id} as ${next}`);
  };

  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-b from-sky-100 via-rose-100 to-amber-100 px-4 py-5">
      {/* emoji bg */}
      <EmojiBackground />

      {/* floating side mascots */}
      <SideMascots />

      {/* header: kid name + streak */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* bigger profile icon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/happy_tigers.png" alt="avatar" className="h-16 w-16 rounded-full border-4 border-white shadow-lg" />
          <div className="leading-tight">
            <div className="text-lg text-sky-700 font-medium">welcome back</div>
            <div className="text-3xl font-extrabold text-sky-900 drop-shadow">{kidName}</div>
          </div>
        </div>
        {/* bigger streak badge */}
        <div className="flex items-center gap-3 rounded-full border-4 border-amber-300 bg-gradient-to-r from-amber-200 to-yellow-200 px-5 py-3 text-lg font-bold text-amber-800 shadow-lg">
          <Trophy className="h-6 w-6 text-amber-600" />
          streak 3
        </div>
      </div>

      {/* big mascots banner on top center */}
      <MascotBanner />

      {/* preset row with bear mascot */}
      <div className="relative">
        {/* bear on the left of preset row */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/bear.png" alt="bear" className="pointer-events-none absolute -left-2 top-8 z-10 hidden md:block" style={{ width: 140, height: 140 }} />

        <div className="ml-0 md:ml-32">
          <SectionHeader title="🎬 preset" />
          <RowScroller>
            {videosLoading ? (
              <div className="flex items-center justify-center w-64 h-48 rounded-3xl border-2 border-amber-200 bg-white/80 shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            ) : videosError ? (
              <div className="flex items-center justify-center w-64 h-48 rounded-3xl border-2 border-red-200 bg-red-50/80 shadow-lg">
                <p className="text-red-600 text-sm text-center px-4">Failed to load videos</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex items-center justify-center w-64 h-48 rounded-3xl border-2 border-gray-200 bg-white/80 shadow-lg">
                <p className="text-gray-600 text-sm text-center px-4">No videos available</p>
              </div>
            ) : (
              videos.map((v) => (
                <VideoCard key={v.id} item={v} onClick={handlePlayVideo} />
              ))
            )}
          </RowScroller>
        </div>
      </div>

      {/* homework row with eagle mascot */}
      <div className="relative mt-8">
        {/* eagle on the left side of homework row */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/eagle.png" alt="eagle" className="pointer-events-none absolute -left-2 top-8 z-10 hidden md:block" style={{ width: 140, height: 140 }} />

        <div className="ml-0 md:ml-32">
          <SectionHeader title="📚 homework" />
          <RowScroller>
            {homeworkLoading ? (
              <div className="flex items-center justify-center w-64 h-48 rounded-3xl border-2 border-sky-200 bg-white/80 shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
              </div>
            ) : homeworkError ? (
              <div className="flex items-center justify-center w-64 h-48 rounded-3xl border-2 border-red-200 bg-red-50/80 shadow-lg">
                <p className="text-red-600 text-sm text-center px-4">Failed to load homework</p>
              </div>
            ) : homeworks.length === 0 ? (
              <div className="flex items-center justify-center w-64 h-48 rounded-3xl border-2 border-gray-200 bg-white/80 shadow-lg">
                <p className="text-gray-600 text-sm text-center px-4">No homework available</p>
              </div>
            ) : (
              homeworks.map((h) => (
                <HomeworkCard key={h.id} item={h} onClick={handleOpenHomework} />
              ))
            )}
          </RowScroller>
        </div>
      </div>

      {/* Game Ready Popup */}
      <GameReadyPopup
        open={showGameReadyPopup}
        onClose={() => setShowGameReadyPopup(false)}
        onStart={handleStartGame}
      />
    </div>
  );
}
