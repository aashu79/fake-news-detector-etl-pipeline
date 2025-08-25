import logging
import os
from pyspark.sql import SparkSession
from datasets import Dataset
from setfit import SetFitModel, SetFitTrainer
from config import MODEL_PATH

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TRAIN_FOLDER = "data/train.csv"  # Spark CSV folder
TEST_FOLDER = "data/test.csv"    # Spark CSV folder

def get_spark():
    return SparkSession.builder.appName("FakeNewsTraining").getOrCreate()

def load_data_spark():
    spark = get_spark()
    
    # Read all CSVs in Spark folders
    train_df_spark = spark.read.option("header", True).csv(TRAIN_FOLDER)
    test_df_spark = spark.read.option("header", True).csv(TEST_FOLDER)
    
    # Keep only necessary columns and drop nulls
    train_df_spark = train_df_spark.select("clean_text", "label").dropna()
    test_df_spark = test_df_spark.select("clean_text", "label").dropna()
    
    # Convert label column to integer
    train_df_spark = train_df_spark.withColumn("label", train_df_spark["label"].cast("int"))
    test_df_spark = test_df_spark.withColumn("label", test_df_spark["label"].cast("int"))
    
    # Convert Spark DataFrame to Pandas
    train_df = train_df_spark.toPandas()
    test_df = test_df_spark.toPandas()
    
    spark.stop()
    
    logger.info(f"Training samples: {len(train_df)}, Test samples: {len(test_df)}")
    return train_df, test_df

def train_model():
    train_df, test_df = load_data_spark()
    
    train_ds = Dataset.from_pandas(train_df)
    test_ds = Dataset.from_pandas(test_df)
    
    # Load SetFit model
    model = SetFitModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    
    trainer = SetFitTrainer(
        model=model,
        train_dataset=train_ds.shuffle(seed=42).select(range(2000)),  # small subset
        eval_dataset=test_ds,
        batch_size=8,
        num_iterations=2,
        num_epochs=2,
        column_mapping={"clean_text": "text", "label": "label"}
    )


    
    logger.info("Training model...")
    trainer.train()
    
    metrics = trainer.evaluate()
    logger.info(f"Evaluation metrics: {metrics}")
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save_pretrained(MODEL_PATH)
    logger.info(f"Model saved to {MODEL_PATH}")
    
    return model

def main():
    model = train_model()
    
    # Quick test prediction
    test_text = "Government announces new healthcare policy"
    pred = model([test_text])
    result = "Real" if pred[0] == 1 else "Fake"
    logger.info(f"Prediction for sample text: {result}")

if __name__ == "__main__":
    main()
