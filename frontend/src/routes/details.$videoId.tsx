import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { getVideoById } from "@/services/api";
import type { Video } from "@/types/video";

export const Route = createFileRoute("/details/$videoId")({
  head: () => ({
    meta: [
      { title: "Détails — Streamflix" },
      { name: "description", content: "Détails de la vidéo et informations complémentaires." },
    ],
  }),
  component: Details,
});

function Details() {
  const { videoId } = useParams({ from: "/details/$videoId" });
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVideoById(videoId)
      .then((data) => {
        if (!cancelled) setVideo(data);
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
      <main>
        {loading && (
          <div className="pt-24">
            <Loader label="Chargement de la vidéo..." />
          </div>
        )}

        {error && !loading && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-24 text-center">
            <p className="text-lg font-semibold text-destructive">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Link>
          </div>
        )}

        {!loading && !error && video && (
          <>
            <section className="relative h-[60vh] min-h-[360px] w-full overflow-hidden">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </section>

            <section className="mx-auto -mt-32 max-w-4xl px-4 pb-12 sm:px-8">
              <div className="rounded-xl bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{video.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {video.duration}
                  </span>
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    {video.category}
                  </span>
                </div>
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  {video.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/player/$videoId"
                    params={{ videoId: String(video.id) }}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Play
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary/80"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
