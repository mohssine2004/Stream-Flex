import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import { getVideoById } from "@/services/api";
import type { Video } from "@/types/video";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication — show toast and redirect if not logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      toast.error("Connexion requise", {
        description: "Vous devez être connecté pour regarder une vidéo.",
      });
      navigate({ to: "/login" });
    }
  }, [navigate]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) return; // Don't fetch if not authenticated

    let cancelled = false;
    setLoading(true);
    getVideoById(videoId)
      .then((data) => {
        if (!cancelled) {
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

  const handleVideoError = (e: any) => {
    console.error("Erreur de lecture vidéo:", e);
    const videoElement = e.target;
    let message = "Erreur de lecture inconnue.";
    
    if (videoElement.error) {
      switch (videoElement.error.code) {
        case 1: message = "Chargement interrompu par l'utilisateur."; break;
        case 2: message = "Erreur réseau lors du chargement."; break;
        case 3: message = "Le format de la vidéo n'est pas supporté par votre navigateur."; break;
        case 4: message = "La vidéo n'a pas pu être chargée ou le lien est invalide."; break;
      }
    }
    setError(`Impossible de lire la vidéo : ${message}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {loading && <Loader label="Préparation du lecteur..." />}

        {error && !loading && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="rounded-lg bg-destructive/10 p-6 border border-destructive/20">
              <p className="text-xl font-bold text-destructive">Oups ! Problème de lecture</p>
              <p className="mt-2 text-muted-foreground">{error}</p>
              <div className="mt-4 text-left text-xs bg-black/40 p-3 rounded font-mono text-zinc-400 max-w-md overflow-hidden">
                <p className="font-bold text-zinc-300 mb-1">Détails techniques :</p>
                <p className="truncate">URL: {video?.video_url}</p>
                <p className="mt-2 text-amber-500">Note: Les liens MinIO sur le port 9001 sont souvent des liens de téléchargement bloqués dans le lecteur. Utilisez le port 9000.</p>
              </div>
            </div>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-2 text-sm font-semibold text-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" /> Retour au catalogue
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
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
              <video
                key={video.video_url}
                src={video.video_url}
                poster={video.thumbnail_url}
                controls
                autoPlay
                preload="auto"
                playsInline
                onError={handleVideoError}
                style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
                className="w-full bg-black"
              >
                Votre navigateur ne supporte pas la lecture vidéo HTML5.
              </video>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-primary">{video.title}</h1>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-zinc-800 px-2 py-0.5 rounded">{video.category}</span>
                <span>•</span>
                <span>{video.duration} secondes</span>
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 max-w-3xl">
                {video.description}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
