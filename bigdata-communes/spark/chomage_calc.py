from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, avg, round

spark = SparkSession.builder \
    .appName("ChomageParCommune") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# Lecture du CSV avec le bon séparateur (;) depuis HDFS
df = spark.read.option("header", "true") \
    .option("inferSchema", "true") \
    .option("delimiter", ";") \
    .csv("hdfs://namenode:8020/data_villes/data/DS_RP_EMPLOI_LR_PRINC_CSV_FR/raw/DS_RP_EMPLOI_LR_PRINC_data.csv")

# Filtrer les lignes selon les critères
df_filtre = df.filter(
    (col("AGE") == "Y_GE15") &
    (col("EDUC") == "_T") &
    (col("SEX") == "_T") &
    (col("GEO_OBJECT") == "COM") &
    ((col("EMPSTA_ENQ") == "_T") | (col("EMPSTA_ENQ") == "2"))
)

# On pivote les données pour avoir les deux colonnes : total & chômeur
df_pivot = df_filtre.groupBy("GEO", "TIME_PERIOD").pivot("EMPSTA_ENQ").agg({"OBS_VALUE": "first"})

# Renommer les colonnes pour plus de clarté
df_pivot = df_pivot.withColumnRenamed("_T", "total").withColumnRenamed("2", "chomeurs")

# Calcul du taux de chômage par commune et par année
df_taux = df_pivot.withColumn("taux_chomage", (col("chomeurs") / col("total")) * 100)

# Moyenne du taux de chômage par commune sur les 3 années
df_resultat = df_taux.groupBy("GEO").agg(round(avg("taux_chomage"), 2).alias("taux_chomage_moyen"))

# 4. Écriture du résultat transformé dans HDFS (en Parquet par exemple)
df_resultat.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/DS_RP_EMPLOI_LR_PRINC_CSV_FR/clean/chomage_moyen_communes.parquet")

# 5. Arrêt de la session Spark
spark.stop()
