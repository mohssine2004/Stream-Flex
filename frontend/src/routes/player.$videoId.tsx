import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import { getVideoById } from "@/services/api";
import type { Video } from "@/types/video";

export const Route = createFileRoute("/player/$videoId")({
  head: () => ({
    meta: [
      { title: "Lecture — Streamflix" },
      { name: "description", content: "Lecteur vidéo en streaming." },
    ],
  }),
  component: Player,
});

function Player() {
  const { videoId } = useParams({ from: "/player/$videoId" });
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVideoById(videoId)
      .then((data) => {
        if (!cancelled) {
          console.log("PLAYING VIDEO URL:", data.video_url);
          setVideo(data);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Vidéo introuvable");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {loading && <Loader label="Préparation du lecteur..." />}

        {error && !loading && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="text-lg font-semibold text-destructive">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
          </div>
        )}

        {!loading && !error && video && (
          <section className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
            <Link
              to="/details/$videoId"
              params={{ videoId: String(video.id) }}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux détails
            </Link>
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
              <video
                key={video.video_url}
                src={video.video_url}
                poster={video.thumbnail_url}
                controls
                autoPlay
                preload="auto"
                playsInline
                crossOrigin="anonymous"
                style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
                className="w-full bg-black shadow-2xl overflow-hidden rounded-lg"
              >
                Votre navigateur ne supporte pas la lecture vidéo HTML5.
              </video>
            </div>
            <div className="mt-6">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{video.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {video.duration} · {video.category}
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                {video.description}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
