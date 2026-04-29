import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function getOAuthUrl() {
  // The redirect_uri MUST match what's registered in Kimi portal
  // Kimi redirects back to this URL after login
  const netlifyCallback = `${window.location.origin}/api/oauth/callback`;
  const apiUrl = "https://dyg-constructora-backend.onrender.com";

  const url = new URL(`${apiUrl}/api/oauth/authorize`);
  url.searchParams.set("redirect_uri", netlifyCallback);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState("");

  // Check if we're in callback mode (Kimi redirected back with code)
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const isCallback = code && state;

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/licitaciones", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle callback from Kimi
  useEffect(() => {
    if (!isCallback || exchangeLoading) return;

    async function exchangeCode() {
      setExchangeLoading(true);
      setExchangeError("");

      try {
        const apiUrl = "https://dyg-constructora-backend.onrender.com";
        const resp = await fetch(`${apiUrl}/api/oauth/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code, state }),
        });

        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error || "Login failed");
        }

        const data = await resp.json();
        // Session cookie is set by the response, redirect to dashboard
        navigate("/licitaciones", { replace: true });
      } catch (err: any) {
        console.error("OAuth exchange failed:", err);
        setExchangeError(err.message || "Error al iniciar sesión");
      } finally {
        setExchangeLoading(false);
      }
    }

    exchangeCode();
  }, [isCallback, code, state, navigate, exchangeLoading]);

  if (isLoading || exchangeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="text-amber-400 animate-pulse text-sm">
          {exchangeLoading ? "Procesando login..." : "Verificando sesión..."}
        </div>
      </div>
    );
  }

  // If in callback mode and got an error, show it
  if (isCallback && exchangeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Card className="w-full max-w-sm bg-[#111827] border-red-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl text-red-400">Error de acceso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm text-center">{exchangeError}</p>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-[#0a0f1a] font-bold"
              onClick={() => {
                setExchangeError("");
                window.location.href = getOAuthUrl();
              }}
            >
              Reintentar
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#1f2937] text-gray-400 hover:text-white hover:border-amber-500"
              onClick={() => navigate("/")}
            >
              Volver al sitio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
      <Card className="w-full max-w-sm bg-[#111827] border-[#1f2937]">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-xl">Panel de Licitaciones</CardTitle>
          <p className="text-gray-400 text-sm mt-2">D&G Constructora SPA</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500 text-xs text-center">
            Accedé al dashboard de oportunidades de Mercado Público.
          </p>
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-[#0a0f1a] font-bold"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Acceder al Panel
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#1f2937] text-gray-400 hover:text-white hover:border-amber-500"
            onClick={() => navigate("/")}
          >
            Volver al sitio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}