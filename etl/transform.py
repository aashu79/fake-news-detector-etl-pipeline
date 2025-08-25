import logging
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, coalesce, lit, concat
from config import FAKE_CSV, TRUE_CSV, TRAIN_CSV, TEST_CSV

logging.basicConfig(level=logging.INFO)

def get_spark():
    # Create Spark session for distributed processing
    return SparkSession.builder.appName("FakeNewsETL").getOrCreate()

def load_and_label(spark):
    # Load fake and real news datasets and add binary labels
    fake_df = spark.read.csv(FAKE_CSV, header=True, inferSchema=True)
    true_df = spark.read.csv(TRUE_CSV, header=True, inferSchema=True)
    
    fake_df = fake_df.withColumn("label", lit(0))  # Fake = 0
    true_df = true_df.withColumn("label", lit(1))  # Real = 1
    
    df = fake_df.unionByName(true_df)
    return df

def preprocess(df):
    # Prepare data for BERT: combine title+text, minimal cleaning
    # BERT needs raw text - it handles tokenization internally
    df = df.withColumn("clean_text", concat(col("title"), lit(" "), col("text")))
    
    # Remove null and empty texts
    df = df.filter(col("clean_text").isNotNull() & (col("clean_text") != ""))
    
    # Select only required columns for training
    return df.select("clean_text", "label")

def split_and_save(df, train_path, test_path, test_ratio=0.2):
    # Split data into train/test sets and save as CSV
    train_df, test_df = df.randomSplit([1 - test_ratio, test_ratio], seed=42)
    train_df.write.csv(train_path, header=True, mode="overwrite")
    test_df.write.csv(test_path, header=True, mode="overwrite")
    return train_path, test_path

def main():
    # Main ETL pipeline orchestration
    spark = get_spark()
    logging.info("Loading and labeling data...")
    df = load_and_label(spark)
    logging.info(f"Loaded {df.count()} rows.")
    
    logging.info("Preprocessing data for BERT...")
    df_clean = preprocess(df)
    logging.info(f"Cleaned {df_clean.count()} rows.")
    
    logging.info("Splitting and saving datasets...")
    train_path, test_path = split_and_save(df_clean, TRAIN_CSV, TEST_CSV)
    logging.info(f"Train dataset saved at {train_path}")
    logging.info(f"Test dataset saved at {test_path}")
    
    spark.stop()

if __name__ == "__main__":
    main()