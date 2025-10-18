import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-extrabold text-foreground" aria-label="Error 404">404</h1>
        <p className="mb-6 text-base md:text-lg text-muted-foreground">Oops! Página no encontrada</p>
        <a
          href="/JS-Event-Loop-Simulator/"
          className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
