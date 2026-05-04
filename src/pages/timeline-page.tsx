import { useMutation, useQuery } from "@apollo/client";
import { AlertCircle, CalendarClock, LogOut, Plus, RefreshCw, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/app-shell";
import { LifeEventDialog, type EgoStateOptions, type LifeEventDialogSubmitValues } from "../components/life-event-dialog";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  LIFE_EVENT_FIELDS,
  LIFE_EVENTS_QUERY,
  CREATE_LIFE_EVENT_MUTATION,
  DELETE_LIFE_EVENT_MUTATION,
  EGO_STATES_QUERY,
  TOP_LIFE_EVENT_LOCATIONS_QUERY,
  UPDATE_LIFE_EVENT_IMPORTANCE_AND_COLOR_MUTATION,
  UPDATE_LIFE_EVENT_MUTATION,
} from "../graphql/life-events";
import { DatePrecision, LifeEventColor, type LifeEventFieldsFragment } from "../gql/graphql";
import { useFragment } from "../gql/fragment-masking";
import { logout } from "../lib/auth";
import { formatLifeEventDate, toYear } from "../lib/life-event-date";
import { getLifeEventColorOption, lifeEventColorOptions } from "../lib/life-event-style";
import { cn } from "../lib/utils";
import { useAuthStore } from "../stores/auth-store";

type TimelineGroup = {
  year: number;
  events: LifeEventFieldsFragment[];
};

export function TimelinePage() {
  const { user, isLoading: isUserLoading, loadUser, clearUser } = useAuthStore();
  const [dialogEvent, setDialogEvent] = useState<LifeEventFieldsFragment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void loadUser().then((loadedUser) => {
      if (isMounted && !loadedUser) {
        window.location.replace("/login.html");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadUser]);

  const { data, loading: areEventsLoading, error: eventsError, refetch } = useQuery(LIFE_EVENTS_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !user,
  });
  const { data: locationsData, refetch: refetchLocations } = useQuery(TOP_LIFE_EVENT_LOCATIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !user,
  });
  const { data: egoStatesData } = useQuery(EGO_STATES_QUERY, {
    fetchPolicy: "cache-first",
    skip: !user,
  });
  const events = useFragment(LIFE_EVENT_FIELDS, data?.lifeEvents ?? []);
  const locationSuggestions = useMemo(
    () => locationsData?.topLifeEventLocations.map((summary) => summary.location).filter(Boolean) ?? [],
    [locationsData],
  );
  const egoStates = useMemo<EgoStateOptions>(
    () => ({
      gyermeki: egoStatesData?.egoStates.gyermeki ?? [],
      szuloi: egoStatesData?.egoStates.szuloi ?? [],
      felnott: egoStatesData?.egoStates.felnott ?? [],
    }),
    [egoStatesData],
  );
  const groups = useMemo(() => groupEventsByYear([...events]), [events]);

  const [createLifeEvent, createState] = useMutation(CREATE_LIFE_EVENT_MUTATION, {
    refetchQueries: [LIFE_EVENTS_QUERY, TOP_LIFE_EVENT_LOCATIONS_QUERY],
    awaitRefetchQueries: true,
  });
  const [updateLifeEvent, updateState] = useMutation(UPDATE_LIFE_EVENT_MUTATION, {
    refetchQueries: [LIFE_EVENTS_QUERY, TOP_LIFE_EVENT_LOCATIONS_QUERY],
    awaitRefetchQueries: true,
  });
  const [deleteLifeEvent, deleteState] = useMutation(DELETE_LIFE_EVENT_MUTATION, {
    refetchQueries: [LIFE_EVENTS_QUERY, TOP_LIFE_EVENT_LOCATIONS_QUERY],
    awaitRefetchQueries: true,
  });
  const [updateImportanceAndColor, quickUpdateState] = useMutation(UPDATE_LIFE_EVENT_IMPORTANCE_AND_COLOR_MUTATION, {
    refetchQueries: [LIFE_EVENTS_QUERY],
    awaitRefetchQueries: true,
  });

  const isSaving = createState.loading || updateState.loading;

  const handleLogout = async () => {
    await logout();
    clearUser();
    window.location.replace("/login.html");
  };

  const openCreateDialog = () => {
    setPageError(null);
    setDialogEvent(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: LifeEventFieldsFragment) => {
    setPageError(null);
    setDialogEvent(event);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSaving || deleteState.loading) {
      return;
    }

    setIsDialogOpen(false);
    setDialogEvent(null);
  };

  const handleSubmit = async (values: LifeEventDialogSubmitValues) => {
    setPageError(null);

    try {
      if (dialogEvent) {
        await updateLifeEvent({
          variables: {
            input: {
              id: dialogEvent.id,
              title: values.title,
              description: values.description,
              location: values.location,
              color: values.color,
              importance: values.importance,
              gyermekiStateIds: values.gyermekiStateIds,
              szuloiStateIds: values.szuloiStateIds,
              felnottStateIds: values.felnottStateIds,
              dateValue: values.dateValue,
              datePrecision: values.datePrecision,
            },
          },
        });
      } else {
        await createLifeEvent({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              location: values.location,
              color: values.color,
              importance: values.importance,
              gyermekiStateIds: values.gyermekiStateIds,
              szuloiStateIds: values.szuloiStateIds,
              felnottStateIds: values.felnottStateIds,
              dateValue: values.dateValue,
              datePrecision: values.datePrecision,
            },
          },
        });
      }

      await refetchLocations();
      setIsDialogOpen(false);
      setDialogEvent(null);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Nem sikerült menteni az eseményt.");
    }
  };

  const handleDelete = async (id: string) => {
    setPageError(null);

    if (!window.confirm("Biztosan törlöd ezt az eseményt?")) {
      return;
    }

    try {
      await deleteLifeEvent({ variables: { id } });
      await refetchLocations();
      setIsDialogOpen(false);
      setDialogEvent(null);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Nem sikerült törölni az eseményt.");
    }
  };

  const handleQuickStyleUpdate = async (event: LifeEventFieldsFragment, values: { importance?: number; color?: LifeEventColor | null }) => {
    setPageError(null);

    try {
      await updateImportanceAndColor({
        variables: {
          input: {
            id: event.id,
            importance: values.importance ?? event.importance,
            color: values.color === undefined ? event.color : values.color,
          },
        },
      });
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Nem sikerült frissíteni az esemény megjelenését.");
    }
  };

  const isInitialLoading = isUserLoading || (areEventsLoading && events.length === 0);
  const visibleError = pageError ?? eventsError?.message ?? null;

  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Élettörténet</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Életút projekt</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {user ? `Bejelentkezve: ${user.displayName ?? user.email}` : "Felhasználó ellenőrzése..."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Új esemény
            </Button>
            <Button variant="outline" onClick={() => void refetch()} disabled={!user || areEventsLoading}>
              <RefreshCw className={`h-4 w-4 ${areEventsLoading ? "animate-spin" : ""}`} />
              Frissítés
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Kijelentkezés
            </Button>
          </div>
        </header>

        {visibleError ? (
          <div role="alert" className="mt-5 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{visibleError}</span>
          </div>
        ) : null}

        <section className="flex-1 py-8">
          {isInitialLoading ? <TimelineLoading /> : null}

          {!isInitialLoading && groups.length === 0 ? <EmptyTimeline onCreate={openCreateDialog} /> : null}

          {!isInitialLoading && groups.length > 0 ? (
            <div className="grid gap-8">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">JELEN</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-9">
                {groups.map((group) => (
                  <TimelineYearGroup
                    key={group.year}
                    group={group}
                    isQuickUpdating={quickUpdateState.loading}
                    onOpenEvent={openEditDialog}
                    onDeleteEvent={handleDelete}
                    onQuickStyleUpdate={handleQuickStyleUpdate}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <LifeEventDialog
        event={dialogEvent}
        locationSuggestions={locationSuggestions}
        egoStates={egoStates}
        isOpen={isDialogOpen}
        isSaving={isSaving}
        isDeleting={deleteState.loading}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}

function TimelineYearGroup({
  group,
  isQuickUpdating,
  onOpenEvent,
  onDeleteEvent,
  onQuickStyleUpdate,
}: {
  group: TimelineGroup;
  isQuickUpdating: boolean;
  onOpenEvent: (event: LifeEventFieldsFragment) => void;
  onDeleteEvent: (id: string) => Promise<void>;
  onQuickStyleUpdate: (event: LifeEventFieldsFragment, values: { importance?: number; color?: LifeEventColor | null }) => Promise<void>;
}) {
  return (
    <section className="grid gap-4">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="h-px bg-border" />
        <h2 className="text-lg font-semibold tracking-normal text-foreground">{group.year}</h2>
      </div>

      <div className="relative grid grid-cols-1 gap-3 pl-5 before:absolute before:left-1.5 before:top-0 before:h-full before:w-px before:bg-border md:grid-cols-2 xl:grid-cols-3">
        {group.events.map((event) => {
          const colorOption = getLifeEventColorOption(event.color);
          const layout = getImportanceLayout(event.importance);

          return (
            <article
              key={event.id}
              className={cn(
                "relative rounded-lg border border-l-4 border-border bg-card text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                colorOption.borderClassName,
                layout.articleClassName,
              )}
            >
              <span className={cn("absolute -left-[1.18rem] top-5 h-3 w-3 rounded-full border-2 border-background", colorOption.dotClassName)} />
              <div className={cn("flex flex-col gap-2", layout.bodyClassName)}>
                <button type="button" className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpenEvent(event)}>
                  <h3 className={cn("font-semibold tracking-normal", layout.titleClassName)}>{event.title}</h3>
                  {event.location ? <p className={cn("mt-2 font-medium", colorOption.textClassName, layout.locationClassName)}>{event.location}</p> : null}
                  {layout.showDescription && event.description ? (
                    <p className={cn("mt-2 line-clamp-2 leading-6 text-muted-foreground", layout.descriptionClassName)}>{event.description}</p>
                  ) : null}
                  {layout.showEgoStates ? <EgoStateChips event={event} limit={layout.egoStateLimit} compact={layout.compactChips} /> : null}
                </button>
                <div className={cn("grid shrink-0 gap-2", layout.controlsClassName)}>
                  <button
                    type="button"
                    className="ml-auto grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Esemény törlése"
                    aria-label="Esemény törlése"
                    onClick={() => void onDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <QuickImportanceControl event={event} compact={layout.compactControls} disabled={isQuickUpdating} onChange={(importance) => onQuickStyleUpdate(event, { importance })} />
                  <QuickColorControl event={event} compact={layout.compactControls} disabled={isQuickUpdating} onChange={(color) => onQuickStyleUpdate(event, { color })} />
                  <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {formatLifeEventDate(event.dateValue, event.datePrecision)}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function QuickImportanceControl({
  event,
  compact,
  disabled,
  onChange,
}: {
  event: LifeEventFieldsFragment;
  compact: boolean;
  disabled: boolean;
  onChange: (importance: number) => Promise<void>;
}) {
  return (
    <div className="flex items-center gap-1" aria-label="Fontosság gyors módosítása">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={cn(
            "grid place-items-center rounded-md transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
            compact ? "h-6 w-6" : "h-7 w-7",
            value <= event.importance ? "text-yellow-600" : "text-muted-foreground",
          )}
          title={`Fontosság: ${value}`}
          aria-label={`Fontosság ${value}`}
          disabled={disabled || value === event.importance}
          onClick={() => void onChange(value)}
        >
          <Star className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4", value <= event.importance ? "fill-current" : "")} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function QuickColorControl({
  event,
  compact,
  disabled,
  onChange,
}: {
  event: LifeEventFieldsFragment;
  compact: boolean;
  disabled: boolean;
  onChange: (color: LifeEventColor | null) => Promise<void>;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className={compact ? "sr-only" : ""}>Szín</span>
      <select
        className={cn(
          "h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
          compact ? "max-w-28" : "",
        )}
        value={event.color ?? ""}
        disabled={disabled}
        onChange={(changeEvent) => void onChange(changeEvent.target.value ? (changeEvent.target.value as LifeEventColor) : null)}
        aria-label="Szín gyors módosítása"
      >
        <option value="">Auto</option>
        {lifeEventColorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EgoStateChips({ event, limit, compact }: { event: LifeEventFieldsFragment; limit: number; compact: boolean }) {
  const stateNames = [...event.gyermekiStates, ...event.szuloiStates, ...event.felnottStates].map((state) => state.name);

  if (stateNames.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {stateNames.slice(0, limit).map((name) => (
        <span key={name} className={cn("rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground", compact ? "px-1.5 py-0.5" : "")}>
          {name}
        </span>
      ))}
      {stateNames.length > limit ? (
        <span className={cn("rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground", compact ? "px-1.5 py-0.5" : "")}>+{stateNames.length - limit}</span>
      ) : null}
    </div>
  );
}

function getImportanceLayout(importance: number) {
  if (importance >= 5) {
    return {
      articleClassName: "p-5 md:col-span-2 xl:col-span-3",
      bodyClassName: "sm:flex-row sm:items-start sm:justify-between",
      controlsClassName: "sm:min-w-48 sm:justify-items-end",
      titleClassName: "text-lg",
      locationClassName: "text-sm",
      descriptionClassName: "text-sm",
      showDescription: true,
      showEgoStates: true,
      egoStateLimit: 6,
      compactChips: false,
      compactControls: false,
    };
  }

  if (importance >= 4) {
    return {
      articleClassName: "p-4 md:col-span-2",
      bodyClassName: "sm:flex-row sm:items-start sm:justify-between",
      controlsClassName: "sm:min-w-44 sm:justify-items-end",
      titleClassName: "text-base",
      locationClassName: "text-sm",
      descriptionClassName: "text-sm",
      showDescription: true,
      showEgoStates: true,
      egoStateLimit: 5,
      compactChips: false,
      compactControls: false,
    };
  }

  if (importance >= 3) {
    return {
      articleClassName: "p-4",
      bodyClassName: "",
      controlsClassName: "",
      titleClassName: "text-base",
      locationClassName: "text-sm",
      descriptionClassName: "text-sm",
      showDescription: true,
      showEgoStates: true,
      egoStateLimit: 3,
      compactChips: true,
      compactControls: true,
    };
  }

  if (importance >= 2) {
    return {
      articleClassName: "p-3",
      bodyClassName: "",
      controlsClassName: "",
      titleClassName: "text-sm",
      locationClassName: "text-xs",
      descriptionClassName: "text-xs",
      showDescription: false,
      showEgoStates: true,
      egoStateLimit: 2,
      compactChips: true,
      compactControls: true,
    };
  }

  return {
    articleClassName: "p-3 opacity-90",
    bodyClassName: "",
    controlsClassName: "",
    titleClassName: "text-sm",
    locationClassName: "text-xs",
    descriptionClassName: "text-xs",
    showDescription: false,
    showEgoStates: false,
    egoStateLimit: 0,
    compactChips: true,
    compactControls: true,
  };
}

function EmptyTimeline({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="grid min-h-[55vh] place-items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-secondary">
            <CalendarClock className="h-5 w-5" aria-hidden="true" />
          </div>
          <CardTitle>Még nincs rögzített életeseményed.</CardTitle>
          <CardDescription>
            Kezdd el az első történettel, például a születéseddel, egy fontos emlékkel vagy egy meghatározó fordulóponttal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Első esemény létrehozása
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineLoading() {
  return (
    <div className="grid gap-4">
      {[2026, 2020, 2010].map((year) => (
        <div key={year} className="grid gap-3">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="h-px bg-border" />
            <div className="h-6 w-14 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="ml-5 h-24 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

function groupEventsByYear(events: LifeEventFieldsFragment[]): TimelineGroup[] {
  const sortedEvents = events.sort((a, b) => {
    const dateDifference = new Date(b.dateValue).getTime() - new Date(a.dateValue).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const groups = new Map<number, LifeEventFieldsFragment[]>();

  for (const event of sortedEvents) {
    const year = toYear(event.dateValue);
    const yearEvents = groups.get(year) ?? [];
    yearEvents.push(event);
    groups.set(year, yearEvents);
  }

  return Array.from(groups.entries()).map(([year, yearEvents]) => ({
    year,
    events: yearEvents,
  }));
}
