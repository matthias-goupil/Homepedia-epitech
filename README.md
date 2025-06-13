# Homepedia-epitech

Pour importer les data finales depuis hdfs vers mongo :
    - Dans le conteneur spark-master => exécuter le script "data_aggregate.py"
    - Dans le conteneur namenode => exécuter cette commande "hdfs dfs -copyToLocal hdfs://namenode:8020/data_villes/data/final/global_communes.parquet /mnt/data/final". Elle va copier les data finales depuis hdfs vers un volume monté dans le conteneur pour avoir accès à cette donnée depusi la mâchine hôte.
    - Il faut setup un venv python puis l'activer puis installer les dépendances dans "requirements.txt" => "pip install -r requirements.txt"
    - Executer le script "\bigdata-communes\ingestion\utils\import_to_mongo.py"