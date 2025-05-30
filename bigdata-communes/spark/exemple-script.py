from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("exemple").getOrCreate()

df = spark.read.csv("hdfs://namenode:8020/data_villes/data/densite_population/clean/insee_rp_hist_1968__Data.csv", header=True, inferSchema=True)

df.show(10)
