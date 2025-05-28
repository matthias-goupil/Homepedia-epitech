"use client";

import { Note } from "@/utils/types/review";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "global",
    header: "Note Globale",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("global")}</div>;
    },
  },
  {
    accessorKey: "environment",
    header: "Environement",
  },
  {
    accessorKey: "transports",
    header: "Transports",
  },
  {
    accessorKey: "security",
    header: "Sécurité",
  },
  {
    accessorKey: "health",
    header: "Santé",
  },
  {
    accessorKey: "sportsAndLeisure",
    header: "Sports et loisirs",
  },
  {
    accessorKey: "culture",
    header: "Cutlute",
  },
  {
    accessorKey: "education",
    header: "Education",
  },
  {
    accessorKey: "shops",
    header: "Magasin",
  },
  {
    accessorKey: "lifeQuality",
    header: "Qualité de la vie",
  },
];

export type CityNoteWithCityName = Note & {
  city: {
    name: string;
    color: string;
  };
};
export const columnsWithCityName: ColumnDef<CityNoteWithCityName>[] = [
  {
    accessorKey: "city",
    header: "",
    cell: ({ row }) => {
      const city = row.getValue("city") as {
        name: string;
        color: string;
      };
      return (
        <div className="font-medium flex items-center gap-2">
          <span
            className="w-2 h-2 block rounded-full bg-red-100"
            style={{
              backgroundColor: city.color,
            }}
          ></span>
          {city.name}
        </div>
      );
    },
  },
  {
    accessorKey: "global",
    header: "Note Globale",
  },
  {
    accessorKey: "environment",
    header: "Environement",
  },
  {
    accessorKey: "transports",
    header: "Transports",
  },
  {
    accessorKey: "security",
    header: "Sécurité",
  },
  {
    accessorKey: "health",
    header: "Santé",
  },
  {
    accessorKey: "sportsAndLeisure",
    header: "Sports et loisirs",
  },
  {
    accessorKey: "culture",
    header: "Cutlute",
  },
  {
    accessorKey: "education",
    header: "Education",
  },
  {
    accessorKey: "shops",
    header: "Magasin",
  },
  {
    accessorKey: "lifeQuality",
    header: "Qualité de la vie",
  },
];
