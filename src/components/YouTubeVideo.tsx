"use client";

interface YouTubeVideoProps {
  videoId: string;
  title: string;
}

export default function YouTubeVideo({ videoId, title }: YouTubeVideoProps) {
  return (
    <div className="youtube-video-container">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
