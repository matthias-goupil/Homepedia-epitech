import pandas as pd
from pymongo import MongoClient
import glob

# 📍 Chemin local où les fichiers Parquet ont été copiés (monté depuis Docker)
parquet_folder = "../../data_villes/final"

# Connexion à MongoDB (change si l'hôte ou le port diffèrent)
client = MongoClient("mongodb://localhost:27017/")
db = client["homepedia"]
collection = db["global_communes"]

# Lecture des fichiers Parquet
files = glob.glob(f"{parquet_folder}/*.parquet")
for file in files:
    print(f"Processing {file}...")
    df = pd.read_parquet(file)
    collection.insert_many(df.to_dict(orient="records"))

print("✅ Données importées avec succès dans MongoDB.")
