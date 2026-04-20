import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Upload, LogIn, LayoutDashboard, LogOut, Home } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user?.role === "admin");
        setUsername(user?.username || "");
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowDropdown(false);
    toast.success("Déconnexion", {
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate({ to: "/login" });
  };

  const initials = username ? username.slice(0, 2).toUpperCase() : "??";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/90 to-transparent">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tighter text-primary sm:text-3xl">
            STREAMFLIX
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
          <Link to="/" className="transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
            Accueil
          </Link>
          <a href="#trending" className="hidden transition-colors hover:text-primary sm:inline">
            Tendances
          </a>
          <a href="#popular" className="hidden transition-colors hover:text-primary sm:inline">
            Populaires
          </a>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 rounded bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/30 sm:text-sm"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              )}

              {/* User Avatar with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-xs font-bold text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                  title={username}
                >
                  {initials}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-[#111] shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="border-b border-zinc-800 px-4 py-3">
                      <p className="text-sm font-bold text-white">{username}</p>
                      <p className="text-xs text-zinc-500">Connecté</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setShowDropdown(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-white"
                      >
                        <Home className="h-4 w-4" />
                        Page d'accueil
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-white"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard Admin
                        </Link>
                      )}

                      <div className="my-1 h-px bg-zinc-800" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded bg-zinc-800/50 px-3 py-1.5 text-xs text-white transition-colors hover:text-primary sm:text-sm"
              >
                <LogIn className="h-3.5 w-3.5" />
                Connexion
              </Link>
              <Link
                to="/signup"
                className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary/90 sm:text-sm"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
