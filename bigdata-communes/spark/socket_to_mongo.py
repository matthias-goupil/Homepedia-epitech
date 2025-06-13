from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import *
from pymongo import MongoClient

spark = SparkSession.builder \
    .appName("SocketToMongoDB") \
    .getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

# Schéma du JSON
note_schema = StructType([
    StructField(k, IntegerType()) for k in [
        "environment", "transports", "security", "health",
        "sportsAndLeisure", "culture", "education", "shops", "lifeQuality"]
] + [StructField("global", DoubleType())])

review_schema = StructType([
    StructField("code", StringType()),
    StructField("note", note_schema),
    StructField("soutenu", IntegerType()),
    StructField("pasSoutenu", IntegerType()),
    StructField("positif", StringType()),
    StructField("negatif", StringType())
])

# Lecture depuis le socket
raw_stream = spark.readStream \
    .format("socket") \
    .option("host", "review-generator") \
    .option("port", 9999) \
    .load()

parsed_stream = raw_stream.select(from_json(col("value"), review_schema).alias("data")).select("data.*")

def update_mongodb(review):
    client = MongoClient("mongodb://mongodb:27017/")
    db = client["homepedia"]
    cities = db["cities"]
    code = review["code"]
    new_review = {
        "note": review["note"],
        "soutenu": review["soutenu"],
        "pasSoutenu": review["pasSoutenu"],
        "positif": review["positif"],
        "negatif": review["negatif"]
    }
    city = cities.find_one({"code": code})
    if city:
        avis = city.get("avis", [])
        avis.append(new_review)
        total = len(avis)
        keys = new_review["note"].asDict().keys()
        avg = {k: round(sum(a["note"][k] for a in avis) / total, 1) for k in keys}
        cities.update_one(
            {"code": code},
            {
                "$set": {
                    "avis": avis,
                    "totatAvis": total,
                    "avisGlobal": avg
                }
            }
        )
        print(f"Ajouté un avis à {code}")

def process_batch(df, epoch_id):
    for row in df.collect():
        update_mongodb(row.asDict())

query = parsed_stream.writeStream \
    .foreachBatch(process_batch) \
    .start()

query.awaitTermination()
