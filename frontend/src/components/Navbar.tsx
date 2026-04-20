import { Link, useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate({ to: "/login" });
  };

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
          <button onClick={handleLogout} className="transition-colors hover:text-primary ml-2 rounded bg-zinc-800/50 px-3 py-1.5 text-xs text-white sm:text-sm">
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
}
