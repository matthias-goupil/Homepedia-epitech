from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit, when, first
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, BooleanType

spark = SparkSession.builder \
    .appName("BPE_Boolean_Facilities") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:8020") \
    .getOrCreate()

# ---------------------------
# 2. Lire le fichier BPE
# ---------------------------
df_bpe = spark.read.option("header", "true") \
    .option("inferSchema", "true") \
    .option("delimiter", ";") \
    .csv("hdfs://namenode:8020/data_villes/data/DS_BPE_CSV_FR/raw/DS_BPE_data.csv")

# ---------------------------
# 3. Lire les métadonnées
# ---------------------------
df_meta = spark.read.option("header", "true").option("delimiter", ";") \
    .csv("hdfs://namenode:8020/data_villes/data/DS_BPE_CSV_FR/raw/DS_BPE_metadata.csv")

# 4. Création du dictionnaire FACILITY_TYPE → LIB_MOD (ex: "F303" → "Cinéma")
df_meta_filtered = df_meta.filter(col("COD_VAR") == "FACILITY_TYPE")
code_to_label = {row['COD_MOD']: row['LIB_MOD'] for row in df_meta_filtered.collect()}

# 5. Sélection des codes de service à extraire (tu peux aussi définir une sous-liste ici)
services_codes = ["C107","C108","C109","C301","C302","C303","C201","A101","A104","A206","A502","A504","A203","A133","B104","B105","B201","B202","B204","B207","B206","B307",
"B315","B316","B312","C701","C702","D201","D106","D233","D307","E102","E107","E108","E109","F101","F103","F104","F105","F106","F108","F114","F119","F303","F203","F120"]
# services_codes = list(code_to_label.keys())

# 6. Filtrage des données utiles
df_filtré = df_bpe \
    .filter((col("TIME_PERIOD") == 2023) & (col("GEO_OBJECT") == "COM")) \
    .filter(col("FACILITY_TYPE").isin(services_codes)) \
    .select("GEO", "FACILITY_TYPE", "OBS_VALUE")

# 7. Création colonne booléenne "present"
df_boolean = df_filtré.withColumn("present", (col("OBS_VALUE").cast("int") > 0).cast("boolean"))

# 8. Construction des combinaisons GEO × SERVICE
df_geo = df_boolean.select("GEO").distinct()
df_services = spark.createDataFrame([(s,) for s in services_codes], ["FACILITY_TYPE"])
df_complet = df_geo.crossJoin(df_services)

# 9. Jointure et remplissage des absents avec False
df_joined = df_complet.join(df_boolean.select("GEO", "FACILITY_TYPE", "present"),
                            on=["GEO", "FACILITY_TYPE"], how="left") \
                      .fillna(False, subset=["present"])

# 10. Pivot (GEO × FACILITY_TYPE)
df_result = df_joined.groupBy("GEO").pivot("FACILITY_TYPE").agg(first("present"))

# 11. Renommage des colonnes avec libellés lisibles
for code, label in code_to_label.items():
    if code in df_result.columns:
        col_clean = label.strip().lower().replace(" ", "_").replace("’", "").replace("'", "")
        df_result = df_result.withColumnRenamed(code, col_clean)

df_final = df_result.withColumnRenamed("GEO", "code_insee")

# Écriture du résultat transformé dans HDFS (en Parquet par exemple)
df_final.write.mode("overwrite").parquet("hdfs://namenode:8020/data_villes/data/DS_BPE_CSV_FR/clean/equipements_communes.parquet")

df_final.show()

# Arrêt de la session Spark
spark.stop()