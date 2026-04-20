import VideoCard from "./VideoCard";
import type { Video } from "@/types/video";

export default function VideoRow({
  title,
  videos,
  id,
}: {
  title: string;
  videos: Video[];
  id?: string;
}) {
  if (!videos || videos.length === 0) return null;
  return (
    <section id={id} className="px-4 py-6 sm:px-8">
      <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-4 sm:gap-4">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}
