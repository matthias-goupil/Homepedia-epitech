import socket
import json
import random
import time
from faker import Faker

faker = Faker("fr_FR")

# Charger les codes INSEE depuis un fichier JSON
def load_city_codes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        cities = json.load(f)
    return [city["code"] for city in cities if "code" in city]

# Utilise le chemin selon l’endroit où le fichier est copié dans l’image Docker
city_codes = load_city_codes("mockCities.json")  # ou "/app/mockCities.json" en conteneur

def generate_fake_review():
    note = {k: random.randint(1, 10) for k in [
        "environment", "transports", "security", "health", "sportsAndLeisure",
        "culture", "education", "shops", "lifeQuality"]}
    note["global"] = round(sum(note.values()) / len(note), 1)
    
    return {
        "code": random.choice(city_codes),
        "note": note,
        "soutenu": random.randint(0, 100),
        "pasSoutenu": random.randint(0, 100),
        "positif": faker.paragraph(nb_sentences=3),
        "negatif": faker.paragraph(nb_sentences=3)
    }

HOST = '0.0.0.0'
PORT = 9999

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen(1)
    print(f"Serveur prêt sur port {PORT}")
    conn, addr = s.accept()
    with conn:
        print(f"Client connecté depuis {addr}")
        while True:
            review = generate_fake_review()
            conn.sendall((json.dumps(review) + "\n").encode("utf-8"))
            time.sleep(5)
