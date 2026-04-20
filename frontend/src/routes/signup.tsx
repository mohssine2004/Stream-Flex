import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Veuillez accepter les conditions d'utilisation et la politique de confidentialité.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    
    console.log("Signup with", { name, email, password, confirmPassword, acceptTerms });
    
    try {
      const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data));
      
      // Redirection vers la page d'accueil (connexion réussie)
      navigate({ to: "/" });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 py-12">
      {/* Logo */}
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-primary">
          STREAMFLIX
        </Link>
      </div>

      <div className="w-full max-w-[500px] rounded-lg bg-[#0a0a0a] p-8 md:p-14">
        <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
        <p className="mb-8 mt-2 text-zinc-400">Rejoignez Streamflix et profitez du catalogue.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white" htmlFor="name">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              required
            />
          </div>

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
              placeholder="Au moins 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white" htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#141414] px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              required
            />
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className="mt-1 border-zinc-600 data-[state=checked]:border-primary"
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-snug text-zinc-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              J'accepte les conditions d'utilisation et la politique de confidentialité.
            </label>
          </div>

          <button
            type="submit"
            className="!mt-8 w-full rounded-md bg-primary py-3.5 font-bold text-white transition-colors hover:bg-primary/90"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-8 text-zinc-400">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="font-bold text-white hover:underline">
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
