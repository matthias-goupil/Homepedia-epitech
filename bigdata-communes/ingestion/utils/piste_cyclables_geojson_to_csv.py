import json
import csv
import argparse
import os

def convert_geojson_to_csv(input_path, output_path, split_coords=False):
    with open(input_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    rows = []
    all_fieldnames = set()

    for feature in geojson_data["features"]:
        props = feature["properties"].copy()
        geometry = feature["geometry"]

        if geometry["type"] == "LineString" and geometry["coordinates"]:
            if split_coords:
                lon, lat = geometry["coordinates"][0]
                props["lon"] = lon
                props["lat"] = lat
            else:
                props["coordinates"] = str(geometry["coordinates"])
        else:
            if split_coords:
                props["lon"] = ""
                props["lat"] = ""
            else:
                props["coordinates"] = ""

        rows.append(props)
        all_fieldnames.update(props.keys())

    fieldnames = sorted(all_fieldnames)  # tri facultatif pour lisibilité

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ CSV généré : {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert GeoJSON to CSV")
    parser.add_argument("--input", required=True, help="Chemin du fichier .geojson")
    parser.add_argument("--output", required=True, help="Chemin de sortie .csv")
    parser.add_argument("--split-coords", action="store_true",
                        help="Séparer le premier point des coordonnées en colonnes 'lon' et 'lat'")
    args = parser.parse_args()

    convert_geojson_to_csv(args.input, args.output, args.split_coords)
