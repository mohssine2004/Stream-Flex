import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email ou mot de passe incorrect.");
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Connexion réussie !", {
        description: `Bienvenue, ${data.user?.username || "utilisateur"} 👋`,
      });
      
      // Redirect based on role
      if (data.user?.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } catch (error: any) {
      toast.error("Échec de connexion", {
        description: error.message,
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4">
      {/* Logo */}
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-primary">
          STREAMFLIX
        </Link>
      </div>

      {/* Login Card */}
      <div className="mt-16 w-full max-w-[450px] rounded-lg bg-[#0a0a0a] p-8 md:mt-0 md:p-14">
        <h1 className="mb-8 text-3xl font-bold text-white">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              required
            />
          </div>

          <button
            type="submit"
            className="!mt-8 w-full rounded-md bg-primary py-3.5 font-bold text-white transition-colors hover:bg-primary/90"
          >
            Se connecter
          </button>

          <div className="flex items-center justify-between text-sm text-zinc-400">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-zinc-600 data-[state=checked]:border-primary"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
            <a href="#" className="hover:text-white">
              Mot de passe oublié ?
            </a>
          </div>
        </form>

        <div className="mt-16 text-zinc-400">
          Première visite sur Streamflix ?{" "}
          <Link to="/signup" className="font-bold text-white hover:underline">
            Inscrivez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
