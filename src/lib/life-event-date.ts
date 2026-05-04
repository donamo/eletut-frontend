import { DatePrecision } from "../gql/graphql";

export type DateFormValues = {
  precision: DatePrecision;
  year: string;
  month: string;
  dayDate: string;
};

const monthFormatter = new Intl.DateTimeFormat("hu-HU", {
  month: "long",
  timeZone: "UTC",
});

export const months = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1).padStart(2, "0"),
  label: monthFormatter.format(new Date(Date.UTC(2024, index, 1))),
}));

export function toDateInputValue(dateValue: string) {
  return dateValue.slice(0, 10);
}

export function toYear(dateValue: string) {
  return new Date(dateValue).getUTCFullYear();
}

export function dateToFormValues(dateValue?: string, datePrecision: DatePrecision = DatePrecision.Year): DateFormValues {
  const fallback = new Date();
  const date = dateValue ? new Date(dateValue) : fallback;
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dayDate = dateValue ? toDateInputValue(dateValue) : `${year}-${month}-${String(date.getUTCDate()).padStart(2, "0")}`;

  return {
    precision: datePrecision,
    year,
    month,
    dayDate,
  };
}

export function formDateToIso(values: DateFormValues) {
  if (values.precision === DatePrecision.Day) {
    return new Date(`${values.dayDate}T00:00:00.000Z`).toISOString();
  }

  const month = values.precision === DatePrecision.Month ? values.month : "01";
  return new Date(`${values.year}-${month}-01T00:00:00.000Z`).toISOString();
}

export function formatLifeEventDate(dateValue: string, datePrecision: DatePrecision) {
  const date = new Date(dateValue);
  const year = date.getUTCFullYear();

  if (datePrecision === DatePrecision.Year) {
    return String(year);
  }

  const month = monthFormatter.format(date);

  if (datePrecision === DatePrecision.Month) {
    return `${year}. ${month}`;
  }

  return `${year}. ${month} ${date.getUTCDate()}.`;
}
