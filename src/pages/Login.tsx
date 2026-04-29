import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function getOAuthUrl() {
  const apiUrl = "https://dyg-constructora-backend.onrender.com";
  // Tell the backend where to redirect after successful login
  const redirectUrl = `${window.location.origin}/licitaciones`;

  const url = new URL(`${apiUrl}/api/oauth/authorize`);
  url.searchParams.set("redirect_url", redirectUrl);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/licitaciones", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="text-amber-400 animate-pulse text-sm">Verificando sesión...</div>
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