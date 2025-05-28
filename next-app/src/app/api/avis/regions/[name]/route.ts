import { NextResponse } from "next/server";
import { regions } from "@/lib/constants/regions";
import { getDatabase } from "@/lib/mongo";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const { name } = await params;
  const dataRegions = regions.find((el) => el.name === name);
  if (dataRegions) {
    const db = await getDatabase();
    
    const collection = await db.collection("cities");
    const data = await collection
      .find({
        codeRegion: dataRegions.codeRegion,
      })
      .toArray();
    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      message: "Erreur",
    });
  }
}
