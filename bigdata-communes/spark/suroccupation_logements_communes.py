from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, round

spark = SparkSession.builder \
    .appName("Suroccupation Logements") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# Charger le fichier CSV
df = spark.read.option("header", True) \
    .option("sep", ";") \
    .option("inferSchema", True) \
    .csv("hdfs://namenode:8020/data_villes/data/DS_RP_LOGEMENT_COMP_CSV_FR/raw/DS_RP_LOGEMENT_COMP_data.csv")

# Filtrer les lignes GEO_OBJECT = "COM"
communes_df = df.filter(col("GEO_OBJECT") == "COM")

# Calculer la moyenne pour OVEROCC = "1" (logements suroccupés)
surocc_df = communes_df.filter(col("OVEROCC") == "1") \
    .groupBy("GEO") \
    .agg(round(avg("OBS_VALUE"), 2).alias("moyenne_suroccupes"))

# Calculer la moyenne pour OVEROCC = "_T" (logements totaux)
total_df = communes_df.filter(col("OVEROCC") == "_T") \
    .groupBy("GEO") \
    .agg(round(avg("OBS_VALUE"), 2).alias("moyenne_logements_totaux"))

# Joindre les deux moyennes
joined_df = surocc_df.join(total_df, on="GEO", how="inner")

# Ajouter le pourcentage de suroccupation
final_df = joined_df.withColumn(
    "pourcentage_suroccupation",
    round((col("moyenne_suroccupes") / col("moyenne_logements_totaux")) * 100, 2)
)

# Réorganiser les colonnes
result_df = final_df.select(
    col("GEO"),
    col("moyenne_suroccupes").alias("Moyenne logements suroccupés"),
    col("moyenne_logements_totaux").alias("Moyenne logements totaux"),
    col("pourcentage_suroccupation").alias("Pourcentage suroccupation")
)

result_df.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/DS_RP_LOGEMENT_COMP_CSV_FR/clean/suroccupation_logements_communes.parquet")

# Affichage
result_df.show(truncate=False)

# Arrêt de Spark
spark.stop()
