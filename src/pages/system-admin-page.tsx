import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Loader2, RefreshCw, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { UPDATE_USER_ENABLED_MUTATION, USERS_QUERY } from "../graphql/life-events";
import { useAuthStore } from "../stores/auth-store";

export function SystemAdminPage() {
  const { user: currentUser, loadUser } = useAuthStore();
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const { data: usersData, loading: areUsersLoading, refetch: refetchUsers } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !currentUser?.isAdmin,
  });
  const [updateUserEnabled, updateUserState] = useMutation(UPDATE_USER_ENABLED_MUTATION, {
    refetchQueries: [USERS_QUERY],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    void loadUser().then((user) => {
      if (!user) {
        window.location.replace("/login.html");
        return;
      }

      if (!user.isAdmin) {
        setIsAccessDenied(true);
      }
    });
  }, [loadUser]);

  const handleUserEnabledChange = async (id: string, isEnabled: boolean) => {
    setUsersError(null);
    setPendingUserId(id);

    try {
      await updateUserEnabled({
        variables: {
          input: {
            id,
            isEnabled,
          },
        },
      });
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "Nem sikerült módosítani a felhasználó státuszát.");
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rendszeradmin</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Felhasználók kezelése</h1>
          </div>
          <Button variant="outline" onClick={() => window.location.assign("/index.html")}>
            <ArrowLeft className="h-4 w-4" />
            Vissza
          </Button>
        </header>

        {isAccessDenied ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Nincs rendszeradmin jogosultságod</CardTitle>
              <CardDescription>Ez az oldal csak rendszeradmin felhasználóknak érhető el.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {!isAccessDenied ? (
        <Card className="mt-8">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Felhasználók engedélyezése</CardTitle>
              <CardDescription>A whitelist státusz soronként kapcsolható. A tiltott felhasználók nem férnek hozzá a backend védett funkcióihoz.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => void refetchUsers()} disabled={areUsersLoading}>
              <RefreshCw className={`h-4 w-4 ${areUsersLoading ? "animate-spin" : ""}`} />
              Frissítés
            </Button>
          </CardHeader>
          <CardContent>
            {usersError ? <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{usersError}</p> : null}
            {areUsersLoading ? <p className="text-sm text-muted-foreground">Felhasználók betöltése...</p> : null}
            <div className="overflow-hidden rounded-md border border-border">
              <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_auto] gap-4 border-b border-border bg-muted px-4 py-2 text-xs font-semibold uppercase text-muted-foreground md:grid">
                <span>Felhasználó</span>
                <span>Google azonosító</span>
                <span>Státusz</span>
                <span className="text-right">Művelet</span>
              </div>
              <div className="divide-y divide-border">
                {usersData?.users.map((user) => {
                  const isCurrentUser = currentUser?.id === user.id;
                  const isMutating = pendingUserId === user.id;

                  return (
                    <div key={user.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.4fr_1fr_0.8fr_auto] md:items-center md:gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{user.displayName || user.email}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{user.googleSubject}</p>
                      <span
                        className={`w-fit rounded-md px-2.5 py-1 text-xs font-medium ${
                          user.isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.isEnabled ? "Engedélyezve" : "Tiltva"}
                      </span>
                      <Button
                        variant={user.isEnabled ? "outline" : "default"}
                        size="sm"
                        className="justify-self-start md:justify-self-end"
                        disabled={updateUserState.loading || isCurrentUser}
                        title={isCurrentUser ? "A saját felhasználó tiltása itt nem engedélyezett." : undefined}
                        onClick={() => void handleUserEnabledChange(user.id, !user.isEnabled)}
                      >
                        {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : user.isEnabled ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        {user.isEnabled ? "Tiltás" : "Engedélyezés"}
                      </Button>
                    </div>
                  );
                })}
                {!areUsersLoading && usersData?.users.length === 0 ? <p className="px-4 py-6 text-sm text-muted-foreground">Nincs megjeleníthető felhasználó.</p> : null}
              </div>
            </div>
          </CardContent>
        </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
