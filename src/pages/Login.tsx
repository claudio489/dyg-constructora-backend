import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getOAuthUrl() {
  // Redirect to backend OAuth authorize endpoint
  // Backend will redirect to Kimi, then Kimi redirects back to backend callback,
  // then backend sets cookie and redirects back to frontend
  const apiUrl = "https://dyg-constructora-backend.onrender.com";
  const frontendUrl = `${window.location.origin}/login`;
  
  const url = new URL(`${apiUrl}/api/oauth/authorize`);
  url.searchParams.set("redirect_uri", frontendUrl);
  
  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Sign in with Kimi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
