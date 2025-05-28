"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { City } from "@/utils/types/city";
import { CityNoteChart } from "./cityNoteChart";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import Review from "./review";
import { DataTable } from "./dataTable";
import {
  CityNoteWithCityName,
  columnsWithCityName,
} from "./cityNoteColums";
import { CircleX } from "lucide-react";
import ReviewsDialog from "./reviewsDialog";

interface ICityComparatorProps {
  cities: City[];
  open: boolean;
  onClose: () => void;
  onRemoveCity: (removedCity: number) => void;
}

const colors = ["#d24470", "#3c87d9", "#935eff", "#e4593c"];
function CityComparator({
  open,
  cities,
  onClose,
  onRemoveCity,
}: ICityComparatorProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Comparateur</SheetTitle>
        </SheetHeader>

        {cities.length > 0 && (
          <div className="p-4 flex flex-col gap-4">
            <div className="bg-slate-50 rounded p-4">
              <h2 className="font-semibold mb-3">Villes sélectionnées</h2>
              <div className="flex items-center gap-x-2 gap-y-2 flex-wrap">
                {cities.map((city, index) => (
                  <Badge
                    key={`${city.nom}-${city.code}`}
                    style={{
                      backgroundColor: colors[index] || "red",
                    }}
                    className="font-normal"
                  >
                    {city.nom} - {city.code}
                    <span
                      onClick={() => {
                        console.log(index);
                        onRemoveCity(index);
                      }}
                    >
                      <CircleX className="cursor-pointer" width={15} />
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="w-full mb-7 bg-slate-50">
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  Données spider
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  Données tabulaire
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <CityNoteChart
                  notes={cities.map((city, index) => ({
                    cityName: city.nom,
                    color: colors[index] || "red",
                    note: city.avisGlobal
                  }))}
                />
              </TabsContent>
              <TabsContent value="table">
                <DataTable
                  columns={columnsWithCityName}
                  data={
                    cities
                      .map((city, index) => ({
                        city: {
                          name: city.nom,
                          color: colors[index],
                        },
                        ...city.avisGlobal,
                      }))
                      .filter(Boolean) as CityNoteWithCityName[]
                  }
                />
              </TabsContent>
            </Tabs>

            <div>
              <Tabs
                defaultValue={`${cities[0].nom}-${cities[0].code}`}
                className="w-full"
              >
                <TabsList className="w-full bg-slate-50 flex-wrap flex h-auto">
                  {cities.map((city, index) => (
                    <TabsTrigger
                      key={`${city.nom}-${city.code}`}
                      value={`${city.nom}-${city.code}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: colors[index] || "red",
                        }}
                      ></span>
                      {`${city.nom} (${city.code})`}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {cities.map((city) => (
                  <TabsContent
                    key={`${city.nom}-${city.code}`}
                    value={`${city.nom}-${city.code}`}
                  >
                    <ReviewsDialog city={city} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CityComparator;
