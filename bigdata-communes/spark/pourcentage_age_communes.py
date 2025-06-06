from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, sum as spark_sum, round, lit

# Création de la session Spark
spark = SparkSession.builder \
    .appName("PopulationAgePercentage") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# ---------------------------
# 1. Lire le fichier CSV
# ---------------------------
df = spark.read.option("header", "true") \
    .option("inferSchema", "true") \
    .option("delimiter", ";") \
    .csv("hdfs://namenode:8020/data_villes/data/DS_RP_POPULATION_PRINC_CSV_FR/raw/DS_RP_POPULATION_PRINC_data.csv")

# ---------------------------
# 2. Filtrer les lignes utiles
# ---------------------------
filtered_df = df.filter((col("SEX") == "_T") & (col("GEO_OBJECT") == "COM"))

# Séparer les tranches d'âges normales et le total "_T"
age_df = filtered_df.filter(col("AGE") != "_T")
total_df = filtered_df.filter(col("AGE") == "_T")

# ---------------------------
# 3. Moyenne des valeurs pour chaque tranche d'âge
# ---------------------------
avg_by_age = age_df.groupBy("GEO", "AGE").agg(
    avg("OBS_VALUE").alias("avg_value")
)

# ---------------------------
# 4. Moyenne des totaux (AGE == "_T") pour chaque commune
# ---------------------------
total_by_geo = total_df.groupBy("GEO").agg(
    avg("OBS_VALUE").alias("total_value")
)

# ---------------------------
# 5. Calcul du pourcentage
# ---------------------------
joined_df = avg_by_age.join(total_by_geo, on="GEO")

result_df = joined_df.withColumn(
    "percent", round((col("avg_value") / col("total_value")) * 100, 2)
)

# ---------------------------
# 6. Ajouter la ligne totale AGE = "_T" avec 100%
# ---------------------------
total_final = total_by_geo.withColumn("AGE", lit("_T")) \
    .withColumnRenamed("total_value", "avg_value") \
    .withColumn("percent", lit(100.0))

# ---------------------------
# 7. Union et affichage final
# ---------------------------
final_df = result_df.select("GEO", "AGE", "avg_value", "percent") \
    .unionByName(total_final.select("GEO", "AGE", "avg_value", "percent")) \
    .orderBy("GEO", "AGE")

final_df.show(truncate=False)

final_df.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/DS_RP_POPULATION_PRINC_CSV_FR/clean/pourcentages_age_communes.parquet")

# Fermeture de la session
spark.stop()
