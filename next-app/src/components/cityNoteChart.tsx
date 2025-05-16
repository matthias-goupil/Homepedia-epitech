"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Note } from "@/utils/types/review";

const defaultChartData = [
  { month: "Environement" },
  { month: "Transports" },
  { month: "Sécurité" },
  { month: "Santé" },
  { month: "Sports et Loisirs" },
  { month: "Culture" },
  { month: "Education" },
  { month: "Magasin" },
  { month: "Qualité de vie" },
];

interface ICityNoteChartProps {
  notes: {
    cityName: string;
    note?: Note;
    color?: string;
  }[];
}

export function CityNoteChart({ notes }: ICityNoteChartProps) {
  const chartData = notes.reduce((acc, curr) => {
    console.log(curr);
    if (curr.note) {
      acc[0][curr.cityName] = curr.note.environment;
      acc[1][curr.cityName] = curr.note.transports;
      acc[2][curr.cityName] = curr.note.security;
      acc[3][curr.cityName] = curr.note.health;
      acc[4][curr.cityName] = curr.note.sportsAndLeisure;
      acc[5][curr.cityName] = curr.note.culture;
      acc[6][curr.cityName] = curr.note.education;
      acc[7][curr.cityName] = curr.note.shops;
      acc[8][curr.cityName] = curr.note.lifeQuality;
    }

    return acc;
  }, defaultChartData as any);

  const chartConfig = notes.reduce((acc: any, curr) => {
    acc[curr.cityName] = {
      label: curr.cityName,
      color: curr.color,
    };
    return acc;
  }, {}) satisfies ChartConfig;

  console.log(chartData);
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full mx-auto aspect-square max-h-[250px]"
    >
      <RadarChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        {Object.keys(chartConfig).map((city) => {
          return (
            <Radar
              dataKey={city}
              fill={chartConfig[city].color}
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          );
        })}
      </RadarChart>
    </ChartContainer>
  );
}
