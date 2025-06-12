from pyspark.sql import SparkSession
from functools import reduce

spark = SparkSession.builder \
    .appName("Agrégat de toutes les données") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# Chargement des DataFrames
df_chomage = spark.read.parquet("hdfs://namenode:8020/data_villes/data/DS_RP_EMPLOI_LR_PRINC_CSV_FR/clean/chomage_moyen_communes.parquet")
df_communes = spark.read.parquet("hdfs://namenode:8020/data_villes/data/communes/clean/communes_clean.parquet")
df_dvf = spark.read.parquet("hdfs://namenode:8020/data_villes/data/valeursfoncieres-2024/clean/dvf_analysis.parquet")
df_equipements = spark.read.parquet("hdfs://namenode:8020/data_villes/data/DS_BPE_CSV_FR/clean/equipements_communes.parquet")
df_metro = spark.read.parquet("hdfs://namenode:8020/data_villes/data/transports/metro/clean/metro_communes.parquet")
df_age_categorie = spark.read.parquet("hdfs://namenode:8020/data_villes/data/DS_RP_POPULATION_PRINC_CSV_FR/clean/pourcentages_age_communes.parquet")
df_suroccupation = spark.read.parquet("hdfs://namenode:8020/data_villes/data/DS_RP_LOGEMENT_COMP_CSV_FR/clean/suroccupation_logements_communes.parquet")

df_dvf = df_dvf.drop("code_commune","code_departement","nom_commune")

# Joindre tous les DataFrames sur code_insee
dfs = [df_communes, df_chomage, df_dvf, df_equipements, df_metro, df_age_categorie, df_suroccupation]

dfs = [df.dropDuplicates(["code_insee"]) for df in dfs]


df_final = reduce(
    lambda left, right: left.join(right, on="code_insee", how="outer"),
    dfs
)

df_final = df_final.orderBy("code_insee")

# Enregistrer ou afficher un échantillon
df_final.show(truncate=False)

# (Optionnel) Sauvegarder au format Parquet
df_final.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/final/global_communes.parquet")

spark.stop()
