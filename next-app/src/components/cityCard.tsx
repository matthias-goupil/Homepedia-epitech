import React from "react";
import { Button } from "./ui/button";
import { Card, CardFooter, CardTitle } from "./ui/card";

interface CityCardProps {
  cityName: string;
  onAddToComparator: () => void,
  onMoreInformation: () => void
}

function CityCard({ cityName, onAddToComparator, onMoreInformation }: CityCardProps) {
  return (
    <Card className="p-4">
      <CardTitle>{cityName}</CardTitle>
      <CardFooter className="gap-4">
        <Button onClick={onMoreInformation}>Plus d'info</Button>
        <Button onClick={onAddToComparator}>Ajouter au comparateur</Button>
      </CardFooter>
    </Card>
  );
}

export default CityCard;
