import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import VideoRow from "@/components/VideoRow";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { getVideos } from "@/services/api";
import type { Video } from "@/types/video";
import { Play, Info, Search } from "lucide-react";

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

function WelcomeHero() {
  return (
    <div className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-black px-4 text-center">
      {/* Background Image/Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=2000"
          alt="Streaming background"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl space-y-6">
        <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary ring-1 ring-primary/30">
          PROJET CLOUD COMPUTING 2026
        </span>
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl">
          L'expérience ultime du <span className="text-primary">Streaming Cloud</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Découvrez notre plateforme haute performance propulsée par Terraform, MinIO et PostgreSQL sur des clusters Kubernetes. 
          Un catalogue infini, une latence zéro, une expérience premium.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="#catalogue"
            className="flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-primary/90"
          >
            Explorer le catalogue
          </a>
          <Link
            to="/signup"
            className="flex h-12 items-center justify-center rounded-md bg-white/10 px-8 text-lg font-bold text-white backdrop-blur transition-all hover:bg-white/20"
          >
            S'inscrire gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    getVideos()
      .then((data) => {
        if (!cancelled) {
          setVideos(data);
          setFilteredVideos(data);
        }
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

  const categories = ["All", ...new Set(videos.map((v) => v.category))];

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter((v) => v.category === category));
    }
  };

  const byCategory = (cat: string) => 
    filteredVideos.filter((v) => v.category?.toLowerCase() === cat.toLowerCase());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-0">
        <WelcomeHero />

        <div id="catalogue" className="relative z-10 -mt-10 space-y-12 pb-20">
          {/* Category Filter Bar */}
          <div className="sticky top-[72px] z-40 bg-background/80 px-4 py-6 backdrop-blur-md sm:px-8">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between border-b border-zinc-800 pb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight">Notre Bibliothèque</h2>
                <p className="text-sm text-zinc-500">Explorez nos contenus par genre</p>
              </div>
              
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="appearance-none bg-zinc-900 border border-zinc-800 text-white px-6 py-2.5 pr-10 rounded-md font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-zinc-800 transition-all hover:border-zinc-700"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "Tous les Genres" : cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="py-12">
              <Loader label="Chargement du catalogue..." />
            </div>
          )}

          {error && !loading && (
            <div className="flex min-h-[30vh] items-center justify-center px-4 text-center">
              <div>
                <p className="text-lg font-semibold text-destructive">Erreur</p>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && filteredVideos.length === 0 && (
            <div className="flex min-h-[30vh] items-center justify-center px-4 text-center">
              <p className="text-muted-foreground">Aucune vidéo trouvée pour cette catégorie.</p>
            </div>
          )}

          {!loading && !error && filteredVideos.length > 0 && (
            <div className="space-y-12">
              {selectedCategory === "All" ? (
                <>
                  <VideoRow id="trending" title="Trending Now" videos={byCategory("Trending")} />
                  <VideoRow id="popular" title="Popular Videos" videos={byCategory("Popular")} />
                  <VideoRow title="Action & Aventure" videos={byCategory("Action")} />
                  <VideoRow title="Comédie" videos={byCategory("Comedy")} />
                  {/* Show leftovers if any */}
                  {filteredVideos.filter(v => !["Trending", "Popular", "Action", "Comedy"].includes(v.category)).length > 0 && (
                    <VideoRow 
                      title="Autres genres" 
                      videos={filteredVideos.filter(v => !["Trending", "Popular", "Action", "Comedy"].includes(v.category))} 
                    />
                  )}
                </>
              ) : (
                <VideoRow title={selectedCategory} videos={filteredVideos} />
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
