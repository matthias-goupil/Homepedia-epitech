import os
import json
import random
import argparse
from datetime import datetime, timedelta
from faker import Faker

faker = Faker("fr_FR")

def generate_random_note():
    categories = [
        "environment", "transports", "security", "health",
        "sportsAndLeisure", "culture", "education", "shops", "lifeQuality"
    ]
    note = {cat: round(random.uniform(3, 9), 2) for cat in categories}
    note["globalNote"] = round(sum(note.values()) / len(note), 2)
    return note

def generate_review():
    note = generate_random_note()
    review = {
        "date": (datetime.today() - timedelta(days=random.randint(0, 1000))).strftime("%d-%m-%Y"),
        "positif": "Les points positifs : " + faker.paragraph(nb_sentences=3),
        "negatif": "Les points négatifs : " + faker.paragraph(nb_sentences=3),
        "peopleAgree": random.randint(0, 10),
        "peopleDisagree": random.randint(0, 10),
        "note": note
    }
    return review

def generate_city_data(city_name, postal_code="00000"):
    reviews = [generate_review() for _ in range(random.randint(1, 50))]
    note_summary = {k: round(sum(r["note"][k] for r in reviews) / len(reviews), 2)
                    for k in reviews[0]["note"].keys()}
    
    return {
        "cityName": city_name.upper().replace("‑", " "),
        "postalCode": postal_code,
        "totalNotes": len(reviews),
        "note": note_summary,
        "reviews": reviews
    }

def save_city_data(city_data, filepath):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(city_data, f, ensure_ascii=False, indent=2)

def mock_missing_cities(cities_list_file, output_dir):
    with open(cities_list_file, "r", encoding="utf-8") as f:
        cities = json.load(f)

    os.makedirs(output_dir, exist_ok=True)

    for city in cities:
        city_name = city["city"].replace("&#x2011;", "‑")
        postal_code = city.get("postalCode", "00000")
        filename = f"{city_name}.json"
        filepath = os.path.join(output_dir, filename)
        if not os.path.exists(filepath):
            print(f"Mocking {city_name}...")
            city_data = generate_city_data(city_name, postal_code)
            save_city_data(city_data, filepath)

def process_all_departments(departements_dir, output_base_dir):
    for filename in os.listdir(departements_dir):
        if filename.endswith(".json"):
            dept_code = filename.split("_")[1].split(".")[0]  # ex: "62" from "villes_62.json"
            input_file = os.path.join(departements_dir, filename)
            output_dir = os.path.join(output_base_dir, dept_code)
            mock_missing_cities(input_file, output_dir)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Génère des fichiers mock JSON pour chaque ville.")
    parser.add_argument("--input_dir", default="departements", help="Dossier contenant les fichiers villes_XX.json")
    parser.add_argument("--output_base_dir", default="cities", help="Dossier de base pour les fichiers générés")
    args = parser.parse_args()

    process_all_departments(args.input_dir, args.output_base_dir)
