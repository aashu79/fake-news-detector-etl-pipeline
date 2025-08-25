import logging
from pyspark.sql import SparkSession
from config import TRAIN_CSV, POSTGRES_URL, POSTGRES_USER, POSTGRES_PASSWORD

logging.basicConfig(level=logging.INFO)

def get_spark():
    return SparkSession.builder \
        .appName("FakeNewsLoader") \
        .config("spark.jars.packages", "org.postgresql:postgresql:42.7.3") \
        .getOrCreate()

def load_to_postgres(spark, csv_path, db_url, user, password):
    logging.info(f"Reading CSV from {csv_path}")
    df = spark.read.csv(csv_path, header=True, inferSchema=True)

    logging.info("Writing data to PostgreSQL...")
    df.write \
        .format("jdbc") \
        .option("url", db_url) \
        .option("dbtable", "news_data") \
        .option("user", user) \
        .option("password", password) \
        .option("driver", "org.postgresql.Driver") \
        .mode("overwrite") \
        .save()

    logging.info("Data successfully loaded into PostgreSQL table 'news_data'.")

def main():
    spark = get_spark()
    try:
        load_to_postgres(spark, TRAIN_CSV, POSTGRES_URL, POSTGRES_USER, POSTGRES_PASSWORD)
    finally:
        spark.stop()
        logging.info("Spark session stopped.")

if __name__ == "__main__":
    main()