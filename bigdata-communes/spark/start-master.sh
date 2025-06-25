#!/bin/sh
/opt/spark/bin/spark-class org.apache.spark.deploy.master.Master --host spark-master --port 7077 --webui-port 8080
export PATH=$PATH:/opt/spark/bin
tail -f /dev/null