from pyspark.sql import SparkSession

# 1. Création de la SparkSession avec accès HDFS
spark = SparkSession.builder \
    .appName("NettoyageCommunes") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# 2. Lecture du CSV dans HDFS
df = spark.read.option("header", "true").option("inferSchema", "true") \
    .csv("hdfs://namenode:8020/data_villes/data/communes/raw/communes-france-2025.csv")

# 3. Sélection des colonnes utiles
colonnes_a_conserver = [
    "code_insee",
    "nom_standard",
    "reg_code",
    "reg_nom",
    "dep_code",
    "dep_nom",
    "type_commune_unite_urbaine",
    "population",
    "superficie_km2",
    "densite",
    "altitude_moyenne",
    "niveau_equipements_services"
]

df_filtre = df.select(*colonnes_a_conserver)

# 4. Écriture du résultat transformé dans HDFS (en Parquet par exemple)
df_filtre.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/communes/clean/communes_clean.parquet")

df_filtre.show(truncate=False)

# 5. Arrêt de la session Spark
spark.stop()
