import { NextResponse } from "next/server";
import { regions } from "@/lib/constants/regions";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const { name } = await params;
  if (regions.find((el) => el.name === name)) {
    const { type, features } = await import(
      `@/mock/departemens-geojson/${name}.geojson.json`
    );
    return NextResponse.json({ type, features });
  } else {
    return NextResponse.json({
      message: "Erreur",
    });
  }
  // const name = context.params.name
  // console.log(name)
}
