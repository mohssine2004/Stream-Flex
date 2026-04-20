import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import VideoRow from "@/components/VideoRow";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { getVideos } from "@/services/api";
import type { Video } from "@/types/video";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Streamflix — Plateforme de streaming vidéo" },
      {
        name: "description",
        content:
          "Catalogue de vidéos en streaming. Découvrez les tendances, les nouveautés et nos recommandations.",
      },
      { property: "og:title", content: "Streamflix — Streaming vidéo" },
      {
        property: "og:description",
        content: "Plateforme de streaming inspirée de Netflix — projet académique cloud computing.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getVideos()
      .then((data) => {
        if (!cancelled) setVideos(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Erreur de chargement");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const byCategory = (cat: string) => videos.filter((v) => v.category === cat);
  const hero = videos[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-0">
        {loading && (
          <div className="pt-24">
            <Loader label="Chargement du catalogue..." />
          </div>
        )}

        {error && !loading && (
          <div className="flex min-h-[60vh] items-center justify-center px-4 pt-24 text-center">
            <div>
              <p className="text-lg font-semibold text-destructive">Erreur</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="flex min-h-[60vh] items-center justify-center px-4 pt-24 text-center">
            <p className="text-muted-foreground">Aucune vidéo disponible pour le moment.</p>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            <HeroBanner video={hero} />
            <VideoRow id="trending" title="Trending Now" videos={byCategory("Trending")} />
            <VideoRow id="popular" title="Popular Videos" videos={byCategory("Popular")} />
            <VideoRow title="Recently Added" videos={byCategory("Recently Added")} />
            <VideoRow title="Recommended for You" videos={byCategory("Recommended")} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
