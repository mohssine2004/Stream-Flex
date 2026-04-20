import { Link } from "@tanstack/react-router";
import { Play, Info } from "lucide-react";
import type { Video } from "@/types/video";

export default function HeroBanner({ video }: { video: Video | undefined }) {
  if (!video) return null;
  return (
    <section className="relative h-[80vh] min-h-[480px] w-full overflow-hidden">
      <img
        src={video.thumbnail_url}
        alt={video.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end pb-16 sm:justify-center sm:pb-0">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-lg sm:text-6xl">
              {video.title}
            </h1>
            <p className="mt-4 text-base text-foreground/90 drop-shadow sm:text-lg">
              {video.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/player/$videoId"
                params={{ videoId: String(video.id) }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 sm:text-base"
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Link>
              <Link
                to="/details/$videoId"
                params={{ videoId: String(video.id) }}
                className="inline-flex items-center gap-2 rounded-md bg-secondary/80 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-secondary sm:text-base"
              >
                <Info className="h-5 w-5" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
