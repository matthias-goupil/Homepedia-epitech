const fs = require('fs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB || "homepedia";
const COLLECTION_NAME = "cities";

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Lire le fichier JSON (adapté à la taille, ici en une fois)
    const data = JSON.parse(fs.readFileSync('./../next-app/src/mock/mockCities.json', 'utf-8'));

    // Vérifie que c’est un tableau
    if (!Array.isArray(data)) {
      console.error("Le JSON doit être un tableau d'objets.");
      process.exit(1);
    }

    // Insérer tous les documents
    const result = await collection.insertMany(data);
    
    console.log(`Inséré ${result.insertedCount} documents.`);
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await client.close();
    console.log("Connexion fermée.");
  }
}

main();
