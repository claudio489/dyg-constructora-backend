import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard after showing login page briefly
    const timer = setTimeout(() => {
      navigate("/licitaciones", { replace: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
      <Card className="w-full max-w-sm bg-[#111827] border-[#1f2937]">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-xl">Panel de Licitaciones</CardTitle>
          <p className="text-gray-400 text-sm mt-2">D&G Constructora SPA</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500 text-xs text-center">
            Accediendo al dashboard de oportunidades...
          </p>
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-[#0a0f1a] font-bold"
            onClick={() => navigate("/licitaciones")}
          >
            Acceder al Panel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}