import os
import uuid
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from io import BytesIO
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from fastapi.responses import JSONResponse
from pathlib import Path
import logging
import traceback
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from fastapi import Depends
from ..utils.auth import get_current_user
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define router for this module
router = APIRouter()

# Preprocessing request model
class PreprocessRequest(BaseModel):
    upload_id: str  # This will be the ID used to find the uploaded file
    scaling_method: str = "standard"  # Default scaling method can be "standard" or "minmax"
    target_column: str 
# Helper functions for preprocessing


from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# def remove_irrelevant_columns(df, target_column, problem_type="classification", 
#                                importance_threshold=0.01, unique_threshold=0.95, missing_threshold=0.5):
#     df = df.copy()

#     # 1. Drop columns with high uniqueness (mostly useless string columns)
#     high_unique_cols = []
#     for col in df.columns:
#         if df[col].dtype == 'object':
#             unique_ratio = df[col].nunique() / len(df)
#             if unique_ratio > unique_threshold:
#                 high_unique_cols.append(col)

#     if high_unique_cols:
#         logger.info(f"Dropping high uniqueness columns (> {unique_threshold} unique): {high_unique_cols}")
#         df.drop(columns=high_unique_cols, inplace=True)

#     # 2. Drop constant columns
#     constant_cols = df.columns[df.nunique() <= 1].tolist()
#     if constant_cols:
#         logger.info(f"Dropping constant columns (no variance): {constant_cols}")
#         df.drop(columns=constant_cols, inplace=True)

#     # 3. Drop columns with too many missing values
#     high_missing_cols = df.columns[df.isnull().mean() > missing_threshold].tolist()
#     if high_missing_cols:
#         logger.info(f"Dropping columns with >{missing_threshold*100}% missing: {high_missing_cols}")
#         df.drop(columns=high_missing_cols, inplace=True)

#     # 4. Feature Importance based selection
#     if target_column not in df.columns:
#         raise ValueError(f"Target column '{target_column}' not found after cleaning!")

#     X = df.drop(columns=[target_column])
#     y = df[target_column]

#     # Encode any remaining categorical columns
#     X_encoded = X.copy()
#     for col in X_encoded.select_dtypes(include='object').columns:
#         X_encoded[col] = X_encoded[col].astype('category').cat.codes

#     X_encoded.fillna(-999, inplace=True)

#     model = RandomForestClassifier(random_state=42) if problem_type == "classification" else RandomForestRegressor(random_state=42)
#     model.fit(X_encoded, y)

#     importances = model.feature_importances_
#     important_cols = [col for col, imp in zip(X.columns, importances) if imp >= importance_threshold]

#     logger.info(f"Keeping columns based on feature importance > {importance_threshold}: {important_cols}")

#     # Finally keep only important columns + target
#     final_cols = important_cols + [target_column]
#     df = df[final_cols]

#     return df

# # def remove_high_cardinality_columns(df, threshold=0.4):
# #     """
# #     Remove columns where the uniqueness ratio is too high.
# #     Args:
# #         df (pd.DataFrame): The input dataframe
# #         threshold (float): Fraction of unique values above which column is dropped
# #     Returns:
# #         pd.DataFrame: DataFrame with high-cardinality columns removed
# #     """
# #     df = df.copy()
# #     high_cardinality_cols = []

# #     for col in df.columns:
# #         uniqueness_ratio = df[col].nunique() / len(df)
# #         if uniqueness_ratio > threshold:
# #             high_cardinality_cols.append(col)

# #     if high_cardinality_cols:
# #         print(f"Dropping high-cardinality columns (> {threshold} unique): {high_cardinality_cols}")
# #         df.drop(columns=high_cardinality_cols, inplace=True)

# #     return df
def remove_high_cardinality_columns(df, threshold=0.4, target_column=None):
    df = df.copy()
    high_cardinality_cols = []

    for col in df.columns:
        if col == target_column:
            continue
        uniqueness_ratio = df[col].nunique() / len(df)
        if uniqueness_ratio > threshold:
            high_cardinality_cols.append(col)

    if high_cardinality_cols:
        print(f"Dropping high-cardinality columns (> {threshold} unique): {high_cardinality_cols}")
        df.drop(columns=high_cardinality_cols, inplace=True)

    return df


def remove_irrelevant_columns(df, target_column, problem_type=None,
                               importance_threshold=0.01, unique_threshold=0.95, missing_threshold=0.5):
    df = df.copy()

    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in the dataset.")

    # Infer problem type if not provided
    if problem_type is None:
        if pd.api.types.is_numeric_dtype(df[target_column]) and df[target_column].nunique() > 10:
            problem_type = "regression"
        else:
            problem_type = "classification"
        logger.info(f"Inferred problem type as '{problem_type}' based on target column.")

    # 1. Drop high-cardinality object columns
    high_unique_cols = []
    for col in df.columns:
        if df[col].dtype == 'object':
            unique_ratio = df[col].nunique() / len(df)
            if unique_ratio > unique_threshold:
                high_unique_cols.append(col)

    if high_unique_cols:
        logger.info(f"Dropping high uniqueness columns (> {unique_threshold} unique): {high_unique_cols}")
        df.drop(columns=high_unique_cols, inplace=True)

    # 2. Drop constant columns
    constant_cols = df.columns[df.nunique() <= 1].tolist()
    if constant_cols:
        logger.info(f"Dropping constant columns (no variance): {constant_cols}")
        df.drop(columns=constant_cols, inplace=True)

    # 3. Drop columns with too many missing values
    high_missing_cols = df.columns[df.isnull().mean() > missing_threshold].tolist()
    if high_missing_cols:
        logger.info(f"Dropping columns with >{missing_threshold*100:.0f}% missing: {high_missing_cols}")
        df.drop(columns=high_missing_cols, inplace=True)

    # 4. Feature Importance based filtering
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found after cleaning!")

    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Encode categorical features
    X_encoded = X.copy()
    for col in X_encoded.select_dtypes(include='object').columns:
        X_encoded[col] = X_encoded[col].astype('category').cat.codes

    # Handle missing values
    X_encoded.fillna(-999, inplace=True)

    # Train model to determine feature importances
    model = RandomForestClassifier(random_state=42) if problem_type == "classification" else RandomForestRegressor(random_state=42)
    model.fit(X_encoded, y)

    importances = model.feature_importances_
    important_cols = [col for col, imp in zip(X.columns, importances) if imp >= importance_threshold]

    logger.info(f"Keeping columns with feature importance > {importance_threshold}: {important_cols}")

    final_cols = important_cols + [target_column]
    df = df[final_cols]

    return df

def detect_outliers_iqr(df, column):
    """
    Detect outliers using IQR method and filter out extreme values.
    """
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    return df[(df[column] >= (Q1 - 1.5 * IQR)) & (df[column] <= (Q3 + 1.5 * IQR))]

def cap_outliers_iqr(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    df[column] = np.clip(df[column], lower, upper)
    return df

# def clean_data(df, missing_threshold=0.5, cardinality_threshold=0.4):
#     """
#     Clean the dataset:
#     - Remove rows with all NaN
#     - Drop high-missing-value columns
#     - Drop high-cardinality columns
#     - Handle missing values
#     - Cap outliers
#     """

#     df = df.copy()

#     df.dropna(how='all', inplace=True)

#     # Drop columns with too many missing values
#     missing_fraction = df.isnull().mean()
#     cols_to_drop = missing_fraction[missing_fraction > missing_threshold].index.tolist()
#     if cols_to_drop:
#         print(f"Dropping columns with > {missing_threshold*100}% missing: {cols_to_drop}")
#         df.drop(columns=cols_to_drop, inplace=True)

#     # Drop high-cardinality columns
#     df = remove_high_cardinality_columns(df, threshold=cardinality_threshold)

#     # Fill missing values
#     df.fillna(df.median(numeric_only=True), inplace=True)
#     df.fillna("Unknown", inplace=True)

#     # Cap outliers
#     for col in df.select_dtypes(include=[np.number]).columns:
#         df = cap_outliers_iqr(df, col)

#     return df
def clean_data(df, missing_threshold=0.5, cardinality_threshold=0.4, target_column=None):
    df = df.copy()
    df.dropna(how='all', inplace=True)

    # Drop columns with too many missing values (excluding target column)
    missing_fraction = df.isnull().mean()
    cols_to_drop = missing_fraction[(missing_fraction > missing_threshold) & (missing_fraction.index != target_column)].index.tolist()
    if cols_to_drop:
        print(f"Dropping columns with > {missing_threshold*100}% missing: {cols_to_drop}")
        df.drop(columns=cols_to_drop, inplace=True)

    # Drop high-cardinality columns
    df = remove_high_cardinality_columns(df, threshold=cardinality_threshold, target_column=target_column)

    # Fill missing values
    df.fillna(df.median(numeric_only=True), inplace=True)
    df.fillna("Unknown", inplace=True)

    # Cap outliers
    for col in df.select_dtypes(include=[np.number]).columns:
        if col != target_column:
            df = cap_outliers_iqr(df, col)

    return df



# def normalize_data(df, method="standard"):
#     """
#     Normalize/Scale the dataset:
#     - Standard scaling (Z-score) or Min-Max scaling
#     """
#     df = df.copy()
#     numeric_cols = df.select_dtypes(include=[np.number]).columns
#     scaler = StandardScaler() if method == "standard" else MinMaxScaler()
#     df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
#     return df
def normalize_data(df, method="standard", target_column=None):
    """
    Normalize/Scale the dataset:
    - Standard scaling (Z-score) or Min-Max scaling
    - Exclude the target column from scaling.
    """
    df = df.copy()

    # Select numeric columns, but exclude the target_column if it's provided
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if target_column and target_column in numeric_cols:
        numeric_cols.remove(target_column)

    # Choose the appropriate scaler
    scaler = StandardScaler() if method == "standard" else MinMaxScaler()
    
    # Apply scaling only to the numeric columns excluding target_column
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

    return df

# def feature_engineering(df):
    # """
    # Feature Engineering:
    # - Convert datetime columns to separate year, month, day columns.
    # - One-hot encode categorical columns.
    # """
    # df = df.copy()

    # # Convert datetime columns to separate year, month, and day columns
    # for col in df.select_dtypes(include='object').columns:
    #     try:
    #         df[col] = pd.to_datetime(df[col])
    #     except:
    #         continue

    # for col in df.select_dtypes(include='datetime').columns:
    #     df[f"{col}_year"] = df[col].dt.year
    #     df[f"{col}_month"] = df[col].dt.month
    #     df[f"{col}_day"] = df[col].dt.day
    #     df.drop(columns=[col], inplace=True)

    # # One-hot encode categorical columns
    # df = pd.get_dummies(df)

    # return df
from sklearn.preprocessing import LabelEncoder

def feature_engineering(df, target_column):
    """
    Feature Engineering:
    - Label Encode the target column.
    - One-hot encode categorical features.
    """
    df = df.copy()

    # Label encode the target column
    le = LabelEncoder()
    if target_column in df.columns:
        df[target_column] = le.fit_transform(df[target_column])
        logger.info(f"Label encoded target column: {target_column}")
    else:
        raise ValueError(f"Target column '{target_column}' not found in DataFrame.")

    # Convert datetime columns to separate year, month, and day columns
    for col in df.select_dtypes(include='object').columns:
        if col == target_column:
            continue  # Skip target
        try:
            df[col] = pd.to_datetime(df[col])
        except:
            continue

    for col in df.select_dtypes(include='datetime').columns:
        df[f"{col}_year"] = df[col].dt.year
        df[f"{col}_month"] = df[col].dt.month
        df[f"{col}_day"] = df[col].dt.day
        df.drop(columns=[col], inplace=True)

    # Separate categorical and numeric columns
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns

    # Log the columns that are categorical and numerical
    logger.info(f"Categorical columns: {list(categorical_cols)}")
    logger.info(f"Numerical columns: {list(numeric_cols)}")

    # One-hot encode only categorical columns (not the target column)
    feature_cols = [col for col in categorical_cols if col != target_column]
    df = pd.get_dummies(df, columns=feature_cols)  # drop_first to avoid dummy variable trap

    return df  # Return label encoder if needed for inverse transform later

def generate_eda(df: pd.DataFrame) -> dict:
    """
    Generate Exploratory Data Analysis (EDA) summary:
    - Descriptive statistics, value counts, correlation, histograms.
    """
    eda_summary = {
        "description": df.describe(include="all").fillna("").to_dict(),
        "value_counts": {
            col: df[col].value_counts().head(10).to_dict()
            for col in df.columns if df[col].nunique() < 50
        },
        "correlation": df.corr(numeric_only=True).round(3).fillna(0).to_dict(),
        "histograms": {
            col: df[col].dropna().tolist()[:1000]  # Limit histogram data to first 1000 values
            for col in df.select_dtypes(include=[np.number]).columns
        }
    }
    return eda_summary

# def get_file_path(upload_id: str) -> str:
#     tmp_dir = os.path.join(os.path.dirname(__file__), "tmp")

#     # List all files in tmp_dir and match upload_id in filename
#     for filename in os.listdir(tmp_dir):
#         if filename.startswith(upload_id):
#             return os.path.join(tmp_dir, filename)

#     raise HTTPException(status_code=404, detail="File not found")
def get_file_path(upload_id: str, username: str) -> str:
    user_tmp_dir = os.path.join(os.path.dirname(__file__), "tmp", username)

    if not os.path.exists(user_tmp_dir):
        raise HTTPException(status_code=404, detail=f"No files found for user '{username}'")

    for filename in os.listdir(user_tmp_dir):
        if filename.split("__")[-1].startswith(upload_id):  # Match the UUID part
            return os.path.join(user_tmp_dir, filename)

    raise HTTPException(status_code=404, detail=f"File with upload_id '{upload_id}' not found for user '{username}'")

# from ..utils.FilePath import get_file_path
@router.post("/")
async def preprocess_data(payload: PreprocessRequest, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Received preprocessing request: {payload.dict()}")
        username = current_user["username"]
        logger.info(f"Preprocessing request by user: {username}, upload_id: {payload.upload_id}")
        file_path = get_file_path(payload.upload_id, username)
         # Extract username from file_path (assumes structure: tmp/<username>/file.csv)
        username = os.path.normpath(file_path).split(os.sep)[-2]
        logger.info(f"Extracted username: {username}")

        # Step 2: Read the CSV file into a DataFrame
        df = pd.read_csv(file_path)
        logger.info(f"DataFrame loaded: shape={df.shape}, columns={df.columns.tolist()}")

        # Save the original state for later comparison
        original_data = {
            "columns": df.columns.tolist(),
            "shape": df.shape,
        }

        # Step 3: Clean the data
        df_cleaned = clean_data(df,target_column=payload.target_column)
        logger.info(f"Cleaned data: shape={df_cleaned.shape}")
        df_cleaned = remove_irrelevant_columns(df_cleaned, target_column=payload.target_column)
        
        # Step 4: Generate EDA information
        eda_info = generate_eda(df_cleaned)
        logger.info("EDA info generated.")

        # Step 5: Feature engineering
        df_features = feature_engineering(df_cleaned, payload.target_column)
        logger.info(f"Feature engineered data: shape={df_features.shape}")
        logger.info("Target column label encoded.")
        logger.info(df_features[payload.target_column].value_counts())

        # Step 6: Normalize
        df_scaled = normalize_data(df_features, method=payload.scaling_method, target_column=payload.target_column)
        logger.info(f"Normalized data: shape={df_scaled.shape}")

        # Step 7: Save the preprocessed file in clean/<username>/
        clean_dir = os.path.join(os.path.dirname(__file__), "clean", username)
        os.makedirs(clean_dir, exist_ok=True)
        original_filename = os.path.basename(file_path)
        cleaned_file_path = os.path.join(clean_dir, original_filename)
        df_scaled.to_csv(cleaned_file_path, index=False)
        logger.info(f"Saved preprocessed data to: {cleaned_file_path}")

        return JSONResponse({
            "message": "Data preprocessing complete",
            "output_path": str(cleaned_file_path),
            "shape": df_scaled.shape,
            "columns": df_scaled.columns.tolist(),
            "eda": eda_info,
            "original": original_data,
            "preprocessed": {
                "columns": df_scaled.columns.tolist(),
                "shape": df_scaled.shape
            }
        })

    except Exception as e:
        logger.error(f"Preprocessing failed: {e}")
        logger.debug(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Preprocessing failed: {str(e)}")