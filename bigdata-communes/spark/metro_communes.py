from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when

spark = SparkSession.builder \
    .appName("Commune avec métro") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# Charger le fichier CSV des communes sans inférer les types automatiquement
communes_df = spark.read.option("header", True) \
    .option("sep", ",") \
    .option("inferSchema", False) \
    .csv("hdfs://namenode:8020/data_villes/data/communes/raw/communes-france-2025.csv")

# Charger le fichier CSV des stations de métro sans inférer les types automatiquement
metro_df = spark.read.option("header", True) \
    .option("sep", ",") \
    .option("inferSchema", False) \
    .csv("hdfs://namenode:8020/data_villes/data/transports/metro/raw/metro-france.csv")

# Sélectionner uniquement les colonnes utiles et caster en string si nécessaire
communes_codes_df = communes_df.select(col("code_insee").cast("string").alias("code_insee"))
metro_codes_df = metro_df.select(col("`Commune code Insee`").cast("string").alias("code_insee_metro")).distinct()

# Joindre pour détecter la présence de métro
joined_df = communes_codes_df.join(
    metro_codes_df,
    communes_codes_df.code_insee == metro_codes_df.code_insee_metro,
    how="left"
)

# Créer la colonne "metro"
result_df = joined_df.withColumn(
    "metro", when(col("code_insee_metro").isNotNull(), True).otherwise(False)
).select("code_insee", "metro")

# Trier les communes avec métro en premier
result_df = result_df.orderBy(col("metro").desc())

result_df.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/transports/metro/clean/metro_communes.parquet")

# Affichage
result_df.show(truncate=False)

# Stop Spark
spark.stop()
