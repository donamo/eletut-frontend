import { LifeEventColor } from "../gql/graphql";

type ColorOption = {
  value: LifeEventColor;
  label: string;
  dotClassName: string;
  borderClassName: string;
  textClassName: string;
};

export const lifeEventColorOptions: ColorOption[] = [
  {
    value: LifeEventColor.Teal,
    label: "Türkiz",
    dotClassName: "bg-teal-600",
    borderClassName: "border-l-teal-600",
    textClassName: "text-teal-700",
  },
  {
    value: LifeEventColor.Blue,
    label: "Kék",
    dotClassName: "bg-blue-600",
    borderClassName: "border-l-blue-600",
    textClassName: "text-blue-700",
  },
  {
    value: LifeEventColor.Green,
    label: "Zöld",
    dotClassName: "bg-green-600",
    borderClassName: "border-l-green-600",
    textClassName: "text-green-700",
  },
  {
    value: LifeEventColor.Yellow,
    label: "Sárga",
    dotClassName: "bg-yellow-500",
    borderClassName: "border-l-yellow-500",
    textClassName: "text-yellow-700",
  },
  {
    value: LifeEventColor.Orange,
    label: "Narancs",
    dotClassName: "bg-orange-600",
    borderClassName: "border-l-orange-600",
    textClassName: "text-orange-700",
  },
  {
    value: LifeEventColor.Red,
    label: "Piros",
    dotClassName: "bg-red-600",
    borderClassName: "border-l-red-600",
    textClassName: "text-red-700",
  },
  {
    value: LifeEventColor.Pink,
    label: "Rózsaszín",
    dotClassName: "bg-pink-600",
    borderClassName: "border-l-pink-600",
    textClassName: "text-pink-700",
  },
  {
    value: LifeEventColor.Purple,
    label: "Lila",
    dotClassName: "bg-purple-600",
    borderClassName: "border-l-purple-600",
    textClassName: "text-purple-700",
  },
  {
    value: LifeEventColor.Indigo,
    label: "Indigó",
    dotClassName: "bg-indigo-600",
    borderClassName: "border-l-indigo-600",
    textClassName: "text-indigo-700",
  },
  {
    value: LifeEventColor.Cyan,
    label: "Cián",
    dotClassName: "bg-cyan-600",
    borderClassName: "border-l-cyan-600",
    textClassName: "text-cyan-700",
  },
  {
    value: LifeEventColor.Lime,
    label: "Lime",
    dotClassName: "bg-lime-600",
    borderClassName: "border-l-lime-600",
    textClassName: "text-lime-700",
  },
  {
    value: LifeEventColor.Brown,
    label: "Barna",
    dotClassName: "bg-amber-800",
    borderClassName: "border-l-amber-800",
    textClassName: "text-amber-800",
  },
  {
    value: LifeEventColor.Gray,
    label: "Szürke",
    dotClassName: "bg-gray-500",
    borderClassName: "border-l-gray-500",
    textClassName: "text-gray-700",
  },
  {
    value: LifeEventColor.Black,
    label: "Fekete",
    dotClassName: "bg-black",
    borderClassName: "border-l-black",
    textClassName: "text-gray-950",
  },
  {
    value: LifeEventColor.White,
    label: "Fehér",
    dotClassName: "bg-white ring-1 ring-gray-300",
    borderClassName: "border-l-gray-300",
    textClassName: "text-gray-600",
  },
  {
    value: LifeEventColor.Magenta,
    label: "Magenta",
    dotClassName: "bg-fuchsia-600",
    borderClassName: "border-l-fuchsia-600",
    textClassName: "text-fuchsia-700",
  },
];

export function getLifeEventColorOption(color: LifeEventColor | null | undefined) {
  return lifeEventColorOptions.find((option) => option.value === color) ?? lifeEventColorOptions[0];
}
