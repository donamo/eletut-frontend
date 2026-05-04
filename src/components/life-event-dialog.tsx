import { ChevronDown, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePrecision, LifeEventColor, type LifeEventFieldsFragment } from "../gql/graphql";
import { dateToFormValues, formDateToIso, months } from "../lib/life-event-date";
import { lifeEventColorOptions } from "../lib/life-event-style";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";

const currentYear = new Date().getUTCFullYear();

export type EgoStateOption = {
  id: string;
  name: string;
  essence: string;
  innerSentence: string;
  sortOrder: number;
};

export type EgoStateOptions = {
  gyermeki: EgoStateOption[];
  szuloi: EgoStateOption[];
  felnott: EgoStateOption[];
};

const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "A cím kötelező.").max(150, "A cím legfeljebb 150 karakter lehet."),
    description: z.string().max(10000, "A leírás legfeljebb 10000 karakter lehet.").optional(),
    location: z.string().max(150, "A helyszín legfeljebb 150 karakter lehet.").optional(),
    color: z.union([z.nativeEnum(LifeEventColor), z.literal("")]).optional(),
    importance: z.coerce.number().int().min(1, "Legalább 1 lehet.").max(5, "Legfeljebb 5 lehet."),
    gyermekiStateIds: z.array(z.string()),
    szuloiStateIds: z.array(z.string()),
    felnottStateIds: z.array(z.string()),
    precision: z.nativeEnum(DatePrecision),
    year: z
      .string()
      .regex(/^\d{4}$/, "Adj meg egy négyjegyű évet.")
      .refine((value) => Number(value) >= 1800 && Number(value) <= currentYear + 1, "Az év nincs életszerű tartományban."),
    month: z.string().regex(/^(0[1-9]|1[0-2])$/, "Válassz hónapot."),
    dayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Adj meg pontos dátumot."),
  })
  .superRefine((value, context) => {
    if (value.precision === DatePrecision.Day) {
      const date = new Date(`${value.dayDate}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime())) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Érvénytelen dátum.",
          path: ["dayDate"],
        });
      }
    }
  });

export type LifeEventFormValues = z.infer<typeof eventFormSchema>;

export type LifeEventDialogSubmitValues = {
  title: string;
  description: string | null;
  location: string | null;
  color: LifeEventColor | null;
  importance: number;
  gyermekiStateIds: string[];
  szuloiStateIds: string[];
  felnottStateIds: string[];
  dateValue: string;
  datePrecision: DatePrecision;
};

type LifeEventDialogProps = {
  event: LifeEventFieldsFragment | null;
  locationSuggestions: string[];
  egoStates: EgoStateOptions;
  isOpen: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onSubmit: (values: LifeEventDialogSubmitValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function LifeEventDialog({
  event,
  locationSuggestions,
  egoStates,
  isOpen,
  isSaving,
  isDeleting,
  onClose,
  onSubmit,
  onDelete,
}: LifeEventDialogProps) {
  const isEditing = Boolean(event);
  const form = useForm<LifeEventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: toDefaultValues(event),
  });
  const precision = form.watch("precision");

  useEffect(() => {
    if (isOpen) {
      form.reset(toDefaultValues(event));
    }
  }, [event, form, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      location: values.location?.trim() ? values.location.trim() : null,
      color: values.color || null,
      importance: values.importance,
      gyermekiStateIds: values.gyermekiStateIds,
      szuloiStateIds: values.szuloiStateIds,
      felnottStateIds: values.felnottStateIds,
      dateValue: formDateToIso(values),
      datePrecision: values.precision,
    });
  });

  const handleDelete = async () => {
    if (!event) {
      return;
    }

    await onDelete(event.id);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="life-event-dialog-title"
        className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="life-event-dialog-title" className="text-lg font-semibold tracking-normal">
              {isEditing ? "Esemény szerkesztése" : "Új esemény"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">A dátum pontossága határozza meg, hogyan jelenik meg az idővonalon.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Bezárás">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 px-5 py-5">
          <Field label="Cím" error={form.formState.errors.title?.message}>
            <Input autoFocus placeholder="Első iskolai napom" {...form.register("title")} />
          </Field>

          <Field label="Leírás" error={form.formState.errors.description?.message}>
            <Textarea placeholder="Írd le, mire emlékszel ebből az időszakból." {...form.register("description")} />
          </Field>

          <div className="grid gap-3">
            <span className="text-sm font-medium">Dátum pontossága</span>
            <Controller
              control={form.control}
              name="precision"
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-muted p-1">
                  {[
                    { value: DatePrecision.Year, label: "Csak év" },
                    { value: DatePrecision.Month, label: "Év és hónap" },
                    { value: DatePrecision.Day, label: "Pontos dátum" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`h-9 rounded-md px-2 text-sm font-medium transition-colors ${
                        field.value === option.value ? "bg-background shadow-sm" : "text-muted-foreground hover:bg-background/60"
                      }`}
                      onClick={() => field.onChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {precision === DatePrecision.Day ? (
            <Field label="Dátum" error={form.formState.errors.dayDate?.message}>
              <Input type="date" {...form.register("dayDate")} />
            </Field>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Év" error={form.formState.errors.year?.message}>
                <Input inputMode="numeric" placeholder="2001" {...form.register("year")} />
              </Field>
              {precision === DatePrecision.Month ? (
                <Field label="Hónap" error={form.formState.errors.month?.message}>
                  <Select {...form.register("month")}>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}
            </div>
          )}

          <Field label="Helyszín" error={form.formState.errors.location?.message}>
            <>
              <Input list="life-event-location-suggestions" placeholder="Budapest, otthon, iskola..." {...form.register("location")} />
              <datalist id="life-event-location-suggestions">
                {locationSuggestions.map((location) => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </>
          </Field>

          <Field label="Fontosság" error={form.formState.errors.importance?.message}>
            <div className="grid gap-2">
              <div className="flex items-center gap-3">
                <Input type="range" min="1" max="5" step="1" {...form.register("importance", { valueAsNumber: true })} />
                <output className="grid h-9 w-10 shrink-0 place-items-center rounded-md bg-secondary text-sm font-semibold">
                  {form.watch("importance")}
                </output>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>5</span>
              </div>
            </div>
          </Field>

          <div className="grid gap-3">
            <span className="text-sm font-medium">Szín</span>
            <Controller
              control={form.control}
              name="color"
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  <button
                    type="button"
                    className={`h-9 rounded-md border text-xs font-medium transition-colors ${
                      !field.value ? "border-primary bg-muted text-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    onClick={() => field.onChange("")}
                  >
                    Auto
                  </button>
                  {lifeEventColorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      title={option.label}
                      aria-label={option.label}
                      className={`grid h-9 place-items-center rounded-md border transition-colors ${
                        field.value === option.value ? "border-primary bg-muted" : "border-border bg-background hover:bg-muted"
                      }`}
                      onClick={() => field.onChange(option.value)}
                    >
                      <span className={`h-4 w-4 rounded-full ${option.dotClassName}`} />
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="grid gap-3">
            <span className="text-sm font-medium">Énállapotok</span>
            <Controller
              control={form.control}
              name="gyermekiStateIds"
              render={({ field }) => <EgoStateSection title="Gyerek" options={egoStates.gyermeki} selectedIds={field.value} onChange={field.onChange} />}
            />
            <Controller
              control={form.control}
              name="szuloiStateIds"
              render={({ field }) => (
                <EgoStateSection title="Szülő" options={egoStates.szuloi} selectedIds={field.value} onChange={field.onChange} />
              )}
            />
            <Controller
              control={form.control}
              name="felnottStateIds"
              render={({ field }) => (
                <EgoStateSection title="Felnőtt" options={egoStates.felnott} selectedIds={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {isEditing ? (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving || isDeleting}>
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "Törlés..." : "Törlés"}
                </Button>
              ) : null}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving || isDeleting}>
                Mégse
              </Button>
              <Button type="submit" disabled={isSaving || isDeleting}>
                {isSaving ? "Mentés..." : "Mentés"}
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function toDefaultValues(event: LifeEventFieldsFragment | null): LifeEventFormValues {
  const dateValues = dateToFormValues(event?.dateValue, event?.datePrecision ?? DatePrecision.Year);

  return {
    title: event?.title ?? "",
    description: event?.description ?? "",
    location: event?.location ?? "",
    color: event?.color ?? "",
    importance: event?.importance ?? 3,
    gyermekiStateIds: event?.gyermekiStates.map((state) => state.id) ?? [],
    szuloiStateIds: event?.szuloiStates.map((state) => state.id) ?? [],
    felnottStateIds: event?.felnottStates.map((state) => state.id) ?? [],
    ...dateValues,
  };
}

function EgoStateSection({
  title,
  options,
  selectedIds,
  onChange,
  defaultOpen = false,
}: {
  title: string;
  options: EgoStateOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  defaultOpen?: boolean;
}) {
  const selectedSet = new Set(selectedIds);

  const toggleState = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedIds, id]);
      return;
    }

    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  return (
    <details className="group rounded-md border border-border bg-background" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium">
        <span>
          {title}
          {selectedIds.length > 0 ? <span className="ml-2 text-xs font-normal text-muted-foreground">{selectedIds.length} kiválasztva</span> : null}
        </span>
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="grid gap-2 border-t border-border p-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">Nincs elérhető elem.</p>
        ) : (
          options.map((option) => (
            <label key={option.id} className="grid cursor-pointer grid-cols-[auto_1fr] gap-2 rounded-md p-2 hover:bg-muted">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={selectedSet.has(option.id)}
                onChange={(event) => toggleState(option.id, event.target.checked)}
              />
              <span>
                <span className="block text-sm font-medium">{option.name}</span>
                <span className="block text-xs leading-5 text-muted-foreground">{option.essence}</span>
                <span className="block text-xs italic leading-5 text-muted-foreground">{option.innerSentence}</span>
              </span>
            </label>
          ))
        )}
      </div>
    </details>
  );
}
