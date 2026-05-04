import { useEffect } from "react";
import { Chrome, Loader2, ShieldCheck } from "lucide-react";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { startGoogleLogin } from "../lib/auth";
import { useAuthStore } from "../stores/auth-store";

export function LoginPage() {
  const { error, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    void loadUser().then((user) => {
      if (isMounted && user) {
        window.location.replace("/index.html");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadUser]);

  return (
    <AppShell>
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-h-[42vh] flex-col justify-between bg-[#f8f4ee] px-6 py-8 text-[#1f2933] sm:px-10 lg:min-h-screen lg:px-14">
          <div className="text-sm font-semibold">Élettörténet</div>
          <div className="max-w-2xl py-16 lg:py-0">
            <p className="mb-5 text-sm font-medium uppercase text-[#8b5d33]">Privát életút idővonal</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              A saját életed fontos eseményei egy rendezett, privát idővonalon.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#52616f]">
              Rögzíts fordulópontokat, emlékeket és történeteket úgy, hogy az adatok csak a bejelentkezett
              felhasználóhoz tartoznak.
            </p>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#637381]">
            Google belépés kizárólag az azonosításhoz. Nincs Drive, Gmail, Calendar vagy Contacts hozzáférés.
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-secondary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>Belépés</CardTitle>
              <CardDescription>Folytasd Google-fiókkal az Élettörténet használatához.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg" onClick={startGoogleLogin} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4" />}
                Belépés Google-fiókkal
              </Button>
              {error ? (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <p className="text-xs leading-5 text-muted-foreground">
                A belépés után a backend session cookie-t állít be, majd az alkalmazás az életút oldalra visz.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
