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
import { columns } from "./cityNoteColums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ReviewsDialog from "./reviewsDialog";
import { Note } from "@/utils/types/review";

interface ICityInformationProps {
  city: City;
  onClose: () => void;
}

function CityInformation({ city, onClose }: ICityInformationProps) {
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {city.cityName} - {city.postalCode}
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 flex flex-col gap-4">
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
                notes={[
                  { cityName: city.cityName, note: city.note, color: "blue" },
                ]}
              />
            </TabsContent>
            <TabsContent value="table">
              {
                <DataTable
                  columns={columns}
                  data={[city.note].filter(Boolean) as Note[]}
                />
              }
            </TabsContent>
          </Tabs>

          <div>
            <h2>Avis des habitants</h2>
            <ReviewsDialog city={city} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CityInformation;
