from pyspark.sql import SparkSession
from pyspark.sql.functions import col, concat_ws, round, avg, regexp_replace, first
from pyspark.sql.types import DoubleType

spark = SparkSession.builder \
    .appName("DVF Analysis") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# Chargement du fichier CSV
df = spark.read.option("header", True) \
    .option("inferSchema", False) \
    .option("delimiter", "|") \
    .csv("hdfs://namenode:8020/data_villes/data/valeursfoncieres-2024/raw/ValeursFoncieres-2024.csv")

# Nettoyage des champs numériques
df_cleaned = df.withColumn(
    "Valeur fonciere", regexp_replace("Valeur fonciere", ",", ".").cast(DoubleType())
).withColumn(
    "Surface reelle bati", regexp_replace("Surface reelle bati", ",", ".").cast(DoubleType())
)

# Filtrer uniquement Appartements et Maisons avec surface valide
filtered_df = df_cleaned.filter(
    (col("Type local").isin("Appartement", "Maison")) &
    (col("Surface reelle bati").isNotNull()) &
    (col("Surface reelle bati") > 0)
)

# Ajouter colonne code_insee = Code departement + Code commune
df_with_insee = filtered_df.withColumn(
    "code_insee", concat_ws("", col("Code departement"), col("Code commune"))
)

# Filtrer uniquement les lignes avec un code_insee de 5 chiffres
df_valid_insee = df_with_insee.filter(
    col("code_insee").rlike("^\d{5}$")
)

# Ajouter prix au m²
df_with_price = df_valid_insee.withColumn(
    "prix_m2", col("Valeur fonciere") / col("Surface reelle bati")
)

# Calculer moyenne du prix au m² par code_insee et type local
avg_price_df = df_with_price.groupBy("code_insee", "Type local").agg(
    round(avg("prix_m2"), 2).alias("prix_moyen_m2"),
    first("Commune").alias("nom_commune"),
    first("Code commune").alias("code_commune"),
    first("Code departement").alias("code_departement")
)

# Résultat final trié par code_insee (ordre croissant) puis type_local
result_df = avg_price_df.select(
    "code_insee",
    "code_commune",
    "code_departement",
    "nom_commune",
    col("Type local").alias("type_local"),
    "prix_moyen_m2"
).orderBy(col("code_insee").asc(), col("type_local").asc())

# Écriture du résultat transformé dans HDFS (en Parquet par exemple)
result_df.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/valeursfoncieres-2024/clean/dvf_analysis.parquet")

# Affichage
result_df.show(truncate=False)

spark.stop()
