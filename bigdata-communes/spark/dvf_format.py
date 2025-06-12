from pyspark.sql import SparkSession
from pyspark.sql.functions import col, concat_ws, round, avg, regexp_replace

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
    "Valeur fonciere", regexp_replace("Valeur fonciere", ",", ".").cast("double")
).withColumn(
    "Surface reelle bati", regexp_replace("Surface reelle bati", ",", ".").cast("double")
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
    # On récupère les autres infos par first() car elles sont identiques pour un code_insee
    # mais on le fera plus bas après pivot
)

# Sélection des infos complémentaires pour joindre après pivot
infos_df = df_with_price.select(
    "code_insee", "Commune", "Code commune", "Code departement"
).dropDuplicates(["code_insee"])

# Pivot pour avoir une seule ligne par code_insee avec colonnes séparées pour appartement et maison
pivot_df = avg_price_df.groupBy("code_insee").pivot("Type local", ["Appartement", "Maison"]).agg(
    round(avg("prix_moyen_m2"), 2)
)

# Renommer les colonnes pour plus de clarté
result_df = pivot_df.withColumnRenamed("Appartement", "prix_moyen_m2_appartement") \
                    .withColumnRenamed("Maison", "prix_moyen_m2_maison")

# Joindre les infos complémentaires (nom commune, codes)
final_df = result_df.join(
    infos_df.withColumnRenamed("Commune", "nom_commune")
            .withColumnRenamed("Code commune", "code_commune")
            .withColumnRenamed("Code departement", "code_departement"),
    on="code_insee",
    how="left"
).select(
    "code_insee",
    "code_departement",
    "code_commune",
    "nom_commune",
    "prix_moyen_m2_appartement",
    "prix_moyen_m2_maison"
).orderBy("code_insee")

# Écriture du résultat transformé dans HDFS (en Parquet)
final_df.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/valeursfoncieres-2024/clean/dvf_analysis.parquet")

# Affichage
final_df.show(truncate=False)

spark.stop()
