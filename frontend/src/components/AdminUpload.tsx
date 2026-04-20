import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { uploadVideo } from "@/services/api";
import { toast } from "sonner";
import { Upload, Film, Image as ImageIcon, CheckCircle2, Loader2, X } from "lucide-react";

export function AdminUpload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Trending",
    duration: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumb") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "video") setVideoFile(e.target.files[0]);
      else setThumbFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile || !thumbFile) {
      toast.error("Veuillez sélectionner à la fois une vidéo et une miniature.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("video", videoFile);
      data.append("thumbnail", thumbFile);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("duration", formData.duration);

      await uploadVideo(data);
      
      setSuccess(true);
      toast.success("Vidéo ajoutée avec succès !");
      
      setTimeout(() => {
        navigate({ to: "/" });
      }, 2000);
    } catch (error: any) {
      toast.error("Erreur lors de l'envoi", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
        <CheckCircle2 className="mb-4 h-24 w-24 text-green-500 animate-bounce" />
        <h2 className="text-3xl font-bold">Téléchargement Réussi !</h2>
        <p className="mt-2 text-zinc-400">Redirection vers l'accueil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-24 pb-12 text-white">
      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-[#0a0a0a] p-8 shadow-2xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajouter une Vidéo</h1>
            <p className="text-zinc-400">Espace Administration — Téléchargement vers MinIO</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Selection */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Video Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Vidéo (.mp4)</label>
              <div className={`relative flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors ${videoFile ? 'border-green-500 bg-green-500/5' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/30'}`}>
                <input
                  type="file"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <div className="text-center">
                  {videoFile ? (
                    <div className="flex flex-col items-center">
                      <Film className="h-8 w-8 text-green-500" />
                      <span className="mt-2 text-xs font-medium text-green-400 truncate max-w-[200px]">{videoFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-xs">Cliquez pour choisir la vidéo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Miniature (.jpg, .png)</label>
              <div className={`relative flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors ${thumbFile ? 'border-green-500 bg-green-500/5' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/30'}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumb")}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <div className="text-center">
                  {thumbFile ? (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-8 w-8 text-green-500" />
                      <span className="mt-2 text-xs font-medium text-green-400 truncate max-w-[200px]">{thumbFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <span className="text-xs">Cliquez pour choisir l'image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-800" />

          {/* Text Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Titre du Film / Série</label>
              <input
                name="title"
                placeholder="Ex: Inception"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white outline-none focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Résumé de la vidéo..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white outline-none focus:border-primary appearance-none"
                >
                  <option value="Trending">Trending</option>
                  <option value="Popular">Popular</option>
                  <option value="New Release">New Release</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Durée (en secondes)</label>
                <input
                  name="duration"
                  type="number"
                  placeholder="Ex: 7200"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Finaliser l'envoi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
