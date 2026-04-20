import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getVideos, getUsers, getAdminStats, uploadVideo, deleteVideo } from "@/services/api";
import { toast } from "sonner";
import type { Video } from "@/types/video";
import {
  Upload, Film, Image as ImageIcon, CheckCircle2, Loader2,
  Users, Video as VideoIcon, LayoutDashboard, Plus, Trash2,
  BarChart3, ChevronRight, Search, LogOut
} from "lucide-react";

type Tab = "overview" | "videos" | "users" | "add";

interface DashboardStats {
  total_users: number;
  total_videos: number;
  categories: { name: string; count: number }[];
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string | null;
}

export function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Add-movie form state
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Trending",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const [searchVideos, setSearchVideos] = useState("");
  const [searchUsers, setSearchUsers] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoadingData(true);
    try {
      const [v, u, s] = await Promise.all([getVideos(), getUsers(), getAdminStats()]);
      setVideos(v);
      setUsers(u);
      setStats(s);
    } catch (e) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoadingData(false);
    }
  }

  // ---------- Add-movie handlers ----------
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

  const handleSubmitMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbFile) {
      toast.error("Veuillez sélectionner la vidéo et la miniature.");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("video", videoFile);
      data.append("thumbnail", thumbFile);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("duration", formData.duration);
      await uploadVideo(data);
      toast.success("Vidéo ajoutée avec succès !");
      setFormData({ title: "", description: "", category: "Trending", duration: "" });
      setVideoFile(null);
      setThumbFile(null);
      loadData();
      setActiveTab("videos");
    } catch (error: any) {
      toast.error("Erreur lors de l'envoi", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return;
    try {
      await deleteVideo(id);
      toast.success("Vidéo supprimée !");
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      toast.error("Erreur", { description: err.message });
    }
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchVideos.toLowerCase()) ||
      v.category.toLowerCase().includes(searchVideos.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchUsers.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Déconnexion", {
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate({ to: "/login" });
  };

  // ---------- Sidebar ----------
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "videos", label: "Vidéos", icon: <VideoIcon className="h-4 w-4" /> },
    { key: "users", label: "Utilisateurs", icon: <Users className="h-4 w-4" /> },
    { key: "add", label: "Ajouter un film", icon: <Plus className="h-4 w-4" /> },
  ];

  if (loadingData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col border-r border-zinc-800/60 bg-[#0d0d0d]">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-zinc-800/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
            <p className="text-xs text-zinc-500">Streamflix Dashboard</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.key && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
            </button>
          ))}
        </nav>

        <div className="border-t border-zinc-800/40 space-y-2 px-4 py-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full rounded-lg bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700/50 hover:text-white"
          >
            ← Retour à l'accueil
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1 p-8">
        {activeTab === "overview" && <OverviewTab stats={stats} videos={videos} users={users} setActiveTab={setActiveTab} />}
        {activeTab === "videos" && (
          <VideosTab
            videos={filteredVideos}
            search={searchVideos}
            setSearch={setSearchVideos}
            onDelete={handleDeleteVideo}
          />
        )}
        {activeTab === "users" && (
          <UsersTab users={filteredUsers} search={searchUsers} setSearch={setSearchUsers} />
        )}
        {activeTab === "add" && (
          <AddMovieTab
            formData={formData}
            videoFile={videoFile}
            thumbFile={thumbFile}
            uploading={uploading}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmitMovie}
          />
        )}
      </main>
    </div>
  );
}


/* =================== OVERVIEW TAB =================== */
function OverviewTab({
  stats,
  videos,
  users,
  setActiveTab,
}: {
  stats: DashboardStats | null;
  videos: Video[];
  users: User[];
  setActiveTab: (t: Tab) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="mt-1 text-zinc-500">Bienvenue sur le tableau de bord d'administration.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Vidéos"
          value={stats?.total_videos ?? 0}
          icon={<VideoIcon className="h-5 w-5" />}
          color="text-blue-400"
          bg="bg-blue-500/10"
          onClick={() => setActiveTab("videos")}
        />
        <StatCard
          label="Total Utilisateurs"
          value={stats?.total_users ?? 0}
          icon={<Users className="h-5 w-5" />}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          onClick={() => setActiveTab("users")}
        />
        <StatCard
          label="Catégories"
          value={stats?.categories?.length ?? 0}
          icon={<BarChart3 className="h-5 w-5" />}
          color="text-amber-400"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Categories breakdown */}
      {stats?.categories && stats.categories.length > 0 && (
        <div className="rounded-xl border border-zinc-800/60 bg-[#111] p-6">
          <h3 className="mb-4 text-lg font-bold">Répartition par catégorie</h3>
          <div className="space-y-3">
            {stats.categories.map((cat) => {
              const pct = stats.total_videos > 0 ? (cat.count / stats.total_videos) * 100 : 0;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{cat.name}</span>
                    <span className="text-zinc-500">{cat.count} vidéos</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent items */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/60 bg-[#111] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Dernières vidéos</h3>
            <button onClick={() => setActiveTab("videos")} className="text-xs text-primary hover:underline">
              Voir tout →
            </button>
          </div>
          {videos.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center gap-3 border-b border-zinc-800/40 py-3 last:border-0">
              <img src={v.thumbnail_url} alt="" className="h-10 w-16 rounded object-cover bg-zinc-800" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{v.title}</p>
                <p className="text-xs text-zinc-500">{v.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-[#111] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Derniers utilisateurs</h3>
            <button onClick={() => setActiveTab("users")} className="text-xs text-primary hover:underline">
              Voir tout →
            </button>
          </div>
          {users.slice(0, 5).map((u) => (
            <div key={u.id} className="flex items-center gap-3 border-b border-zinc-800/40 py-3 last:border-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold uppercase text-zinc-300">
                {u.username.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{u.username}</p>
                <p className="text-xs text-zinc-500">{u.email}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                u.role === "admin" ? "bg-primary/20 text-primary" : "bg-zinc-800 text-zinc-400"
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-[#111] p-6 text-left transition-all hover:border-zinc-700 hover:bg-[#161616] ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
    </button>
  );
}


/* =================== VIDEOS TAB =================== */
function VideosTab({
  videos,
  search,
  setSearch,
  onDelete,
}: {
  videos: Video[];
  search: string;
  setSearch: (s: string) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vidéos</h1>
          <p className="mt-1 text-zinc-500">{videos.length} vidéo(s) dans la bibliothèque</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-zinc-800 bg-[#111] pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800/60 bg-[#111]">
            <tr>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs">Miniature</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs">Titre</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs hidden md:table-cell">Catégorie</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs hidden lg:table-cell">Durée</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {videos.map((v) => (
              <tr key={v.id} className="transition-colors hover:bg-zinc-800/20">
                <td className="px-5 py-3">
                  <img src={v.thumbnail_url} alt="" className="h-10 w-16 rounded object-cover bg-zinc-800" />
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium">{v.title}</p>
                  <p className="truncate text-xs text-zinc-500 max-w-[200px]">{v.description}</p>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                    {v.category}
                  </span>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell text-zinc-400">
                  {Math.floor(Number(v.duration) / 60)}min
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => onDelete(v.id)}
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                  Aucune vidéo trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* =================== USERS TAB =================== */
function UsersTab({
  users,
  search,
  setSearch,
}: {
  users: User[];
  search: string;
  setSearch: (s: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="mt-1 text-zinc-500">{users.length} utilisateur(s) inscrits</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-zinc-800 bg-[#111] pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800/60 bg-[#111]">
            <tr>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs">Avatar</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs">Nom d'utilisateur</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs">Email</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs hidden md:table-cell">Rôle</th>
              <th className="px-5 py-4 font-bold text-zinc-400 uppercase tracking-wider text-xs hidden lg:table-cell">Inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {users.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-zinc-800/20">
                <td className="px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-xs font-bold uppercase text-primary">
                    {u.username.slice(0, 2)}
                  </div>
                </td>
                <td className="px-5 py-3 font-medium">{u.username}</td>
                <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    u.role === "admin"
                      ? "bg-primary/20 text-primary"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell text-zinc-500 text-xs">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* =================== ADD MOVIE TAB =================== */
function AddMovieTab({
  formData,
  videoFile,
  thumbFile,
  uploading,
  onInputChange,
  onFileChange,
  onSubmit,
}: {
  formData: { title: string; description: string; category: string; duration: string };
  videoFile: File | null;
  thumbFile: File | null;
  uploading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumb") => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un film</h1>
        <p className="mt-1 text-zinc-500">Téléchargez une nouvelle vidéo vers MinIO.</p>
      </div>

      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800/60 bg-[#111] p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* File Selection */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Vidéo (.mp4)</label>
              <div className={`relative flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors ${videoFile ? "border-green-500 bg-green-500/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30"}`}>
                <input
                  type="file"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={(e) => onFileChange(e, "video")}
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

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Miniature (.jpg, .png)</label>
              <div className={`relative flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors ${thumbFile ? "border-green-500 bg-green-500/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30"}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "thumb")}
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
                onChange={onInputChange}
                className="w-full rounded-md border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-primary"
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
                onChange={onInputChange}
                className="w-full rounded-md border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  className="w-full rounded-md border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-primary appearance-none"
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
                  onChange={onInputChange}
                  className="w-full rounded-md border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
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
