import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import type { Video } from "@/types/video";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      to="/details/$videoId"
      params={{ videoId: String(video.id) }}
      className="group relative block w-[180px] shrink-0 overflow-hidden rounded-lg bg-card shadow-md transition-all duration-300 hover:z-10 hover:scale-110 hover:shadow-2xl hover:shadow-primary/30 sm:w-[240px]"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground">{video.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{video.description}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{video.duration}</span>
        </div>
      </div>
    </Link>
  );
}
