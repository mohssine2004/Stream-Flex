// API service — connect to backend later by setting VITE_API_URL.
// Falls back to mock data so the UI works standalone.

import type { Video } from "@/types/video";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";

const MOCK_VIDEOS: Video[] = [
  {
    id: 1,
    title: "Big Buck Bunny",
    description:
      "Un lapin géant et débonnaire se réveille pour découvrir trois rongeurs qui le harcèlent. Comédie animée légendaire de la Blender Foundation.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "10 min",
    category: "Trending",
  },
  {
    id: 2,
    title: "Elephant Dream",
    description:
      "Deux personnages explorent un univers mécanique étrange et onirique rempli de rouages et de machines.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "11 min",
    category: "Trending",
  },
  {
    id: 3,
    title: "Sintel",
    description:
      "Une jeune femme part à la recherche d'un dragon qu'elle a perdu, dans un voyage épique à travers des terres fantastiques.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: "15 min",
    category: "Popular",
  },
  {
    id: 4,
    title: "Tears of Steel",
    description:
      "Dans un futur dystopique, une équipe de guerriers et scientifiques tente de sauver le monde grâce aux voyages dans le temps.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "12 min",
    category: "Popular",
  },
  {
    id: 5,
    title: "For Bigger Blazes",
    description:
      "Une démonstration spectaculaire des capacités de Chromecast à travers des images haute qualité.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "2 min",
    category: "Recently Added",
  },
  {
    id: 6,
    title: "For Bigger Escapes",
    description:
      "Évadez-vous avec ce court métrage haut en couleur qui met en valeur le streaming haute définition.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "3 min",
    category: "Recently Added",
  },
  {
    id: 7,
    title: "For Bigger Fun",
    description:
      "Un voyage joyeux et coloré conçu pour démontrer la qualité du streaming vidéo moderne.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "3 min",
    category: "Recently Added",
  },
  {
    id: 8,
    title: "For Bigger Joyrides",
    description:
      "Embarquez pour une balade visuellement saisissante à travers des paysages variés.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: "3 min",
    category: "Recommended",
  },
  {
    id: 9,
    title: "For Bigger Meltdowns",
    description:
      "Une explosion d'émotions et de couleurs dans ce court métrage dynamique.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    duration: "3 min",
    category: "Recommended",
  },
  {
    id: 10,
    title: "Subaru Outback On Street And Dirt",
    description:
      "Aventure tout-terrain à travers des paysages naturels époustouflants.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    duration: "1 min",
    category: "Recommended",
  },
  {
    id: 11,
    title: "Volkswagen GTI Review",
    description:
      "Un essai détaillé d'une voiture iconique, filmé avec une qualité cinématographique.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    duration: "1 min",
    category: "Trending",
  },
  {
    id: 12,
    title: "We Are Going On Bullrun",
    description:
      "Suivez l'aventure d'un rallye automobile international à travers plusieurs pays.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    duration: "1 min",
    category: "Popular",
  },
];

async function tryFetch<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`API fetch failed for ${path}, falling back to mock:`, err);
    return null;
  }
}

export async function getVideos(): Promise<Video[]> {
  const data = await tryFetch<Video[]>("/api/videos");
  if (data) return data;
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_VIDEOS;
}

export async function getVideoById(id: string | number): Promise<Video> {
  const data = await tryFetch<Video>(`/api/videos/${id}`);
  if (data) return data;
  await new Promise((r) => setTimeout(r, 150));
  const video = MOCK_VIDEOS.find((v) => String(v.id) === String(id));
  if (!video) throw new Error("Video not found");
  return video;
}
