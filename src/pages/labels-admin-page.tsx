import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Field } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { LABELS_QUERY, UPDATE_LABEL_MUTATION } from "../graphql/life-events";
import { LifeEventColor } from "../gql/graphql";
import { getLifeEventColorOption, lifeEventColorOptions } from "../lib/life-event-style";
import { useAuthStore } from "../stores/auth-store";

export function LabelsAdminPage() {
  const { loadUser } = useAuthStore();
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [color, setColor] = useState<LifeEventColor>(LifeEventColor.Teal);
  const [error, setError] = useState<string | null>(null);
  const { data, loading } = useQuery(LABELS_QUERY, { fetchPolicy: "cache-and-network" });
  const [updateLabel, updateState] = useMutation(UPDATE_LABEL_MUTATION, {
    refetchQueries: [LABELS_QUERY],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    void loadUser().then((user) => {
      if (!user) {
        window.location.replace("/login.html");
      }
    });
  }, [loadUser]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedNewName = newName.trim();

    if (!trimmedName) {
      setError("A label név kötelező.");
      return;
    }

    try {
      await updateLabel({
        variables: {
          input: {
            name: trimmedName,
            newName: trimmedNewName || undefined,
            color,
          },
        },
      });
      setName("");
      setNewName("");
      setColor(LifeEventColor.Teal);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Nem sikerült menteni a labelt.");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Beállítások</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Labelek kezelése</h1>
          </div>
          <Button variant="outline" onClick={() => window.location.assign("/index.html")}>
            <ArrowLeft className="h-4 w-4" />
            Vissza
          </Button>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Label mentése</CardTitle>
              <CardDescription>Új labelhez add meg a nevet. Meglévő átnevezéséhez a régi név mellé töltsd ki az új nevet.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <Field label="Név">
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="munka, család, utazás..." />
                </Field>
                <Field label="Új név">
                  <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Csak átnevezésnél" />
                </Field>
                <Field label="Szín">
                  <Select value={color} onChange={(event) => setColor(event.target.value as LifeEventColor)}>
                    {lifeEventColorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
                <Button type="submit" disabled={updateState.loading}>
                  {updateState.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Mentés
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meglévő labelek</CardTitle>
              <CardDescription>A labelre kattintva betöltődik szerkesztésre.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <p className="text-sm text-muted-foreground">Betöltés...</p> : null}
              <div className="grid gap-2">
                {data?.labels.map((label) => {
                  const colorOption = getLifeEventColorOption(label.color);
                  return (
                    <button
                      key={label.id}
                      type="button"
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-left hover:bg-muted"
                      onClick={() => {
                        setName(label.name);
                        setNewName("");
                        setColor(label.color);
                      }}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <span className={`h-3 w-3 rounded-full ${colorOption.dotClassName}`} />
                        {label.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{colorOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
