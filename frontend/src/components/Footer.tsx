export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-screen-2xl text-center text-sm text-muted-foreground">
        <p className="text-lg font-extrabold text-primary">STREAMFLIX</p>
        <p className="mt-2">Projet académique de cloud computing — Plateforme de streaming vidéo</p>
        <p className="mt-1 text-xs">© {new Date().getFullYear()} Streamflix. Données de démonstration.</p>
      </div>
    </footer>
  );
}
