"use client";

import React from "react";
import { Map as MapP, Marker } from "pigeon-maps";

function Map() {
  return (
    <MapP defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
      <Marker width={50} anchor={[50.879, 4.6997]} />
    </MapP>
  );
}

export default Map;
