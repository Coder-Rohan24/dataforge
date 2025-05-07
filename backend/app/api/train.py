from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, r2_score, mean_squared_error
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
import joblib
import numpy as np
router = APIRouter()

# Base directory
CLEAN_FOLDER = "./clean"
def get_file_path(upload_id: str) -> str:
    tmp_dir = os.path.join(os.path.dirname(__file__), "tmp")

    # List all files in tmp_dir and match upload_id in filename
    for filename in os.listdir(tmp_dir):
        if filename.startswith(upload_id):
            return os.path.join(tmp_dir, filename)

    raise HTTPException(status_code=404, detail="File not found")
# class TrainRequest(BaseModel):
#     upload_id: str
#     model_type: str  # E.g., "logistic_regression", "decision_tree", "kmeans"
#     target_column: str = None  # Only required for supervised models

# @router.post("/")
# async def train_model(request: TrainRequest):
#     try:
#         print("Received request:", request)

#         # Load cleaned data
#         # file_path = os.path.join(CLEAN_FOLDER, f"{request.upload_id}.csv")
#         clean_dir = os.path.join(os.path.dirname(__file__), "clean")

#         file_path = os.path.join(clean_dir, f"processed_{request.upload_id}.csv")
#         # file_path = get_file_path(request.upload_id)
#         print("Looking for file:", file_path)
        
#         if not os.path.exists(file_path):
#             print("File not found!")
#             raise HTTPException(status_code=404, detail="Cleaned data not found")

#         df = pd.read_csv(file_path)
#         print("Data loaded successfully. Shape:", df.shape)

#         # Supervised Models
#         if request.model_type in ["logistic_regression", "decision_tree","random_forest_classifier","random_forest_regressor","linear_regression"]:
#             print("Training supervised model:", request.model_type)

#             if request.target_column is None or request.target_column not in df.columns:
#                 print("Target column missing or invalid:", request.target_column)
#                 raise HTTPException(status_code=400, detail="Valid target_column required for supervised models")
            
#             X = df.drop(columns=[request.target_column])
#             y = df[request.target_column]

#             print("Split features and target. Features shape:", X.shape, "Target shape:", y.shape)

#             X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#             print("Split into train and test.")

#             if request.model_type == "logistic_regression":
#                 model = LogisticRegression(max_iter=1000)
#                 print("Initialized LogisticRegression model.")
#             elif request.model_type == "random_forest_classifier":
#                 model = RandomForestClassifier(random_state=42)
#                 print("Initialized RandomForestClassifier model.")
#             elif request.model_type == "random_forest_regressor":
#                 model = RandomForestRegressor(random_state=42)
#                 print("Initialized RandomForestRegressor model.")
#             elif request.model_type == "linear_regression": 
#                 model = LinearRegression()
#                 print("Initialized LinearRegression model.")
#             else:
#                 model = DecisionTreeClassifier()
#                 print("Initialized DecisionTreeClassifier model.")

#             model.fit(X_train, y_train)
#             print("Model training complete.")

#             y_pred = model.predict(X_test)
#             print("Model prediction complete.")

#             if request.model_type in ["random_forest_regressor", "linear_regression"]:
#                 r2 = r2_score(y_test, y_pred)
#                 mse = mean_squared_error(y_test, y_pred)
#                 accuracy = None
#                 f1 = None
#                 print(f"R2 Score: {r2}, MSE: {mse}")
#             else:
#                 accuracy = accuracy_score(y_test, y_pred)
#                 f1 = f1_score(y_test, y_pred, average='weighted')
#                 r2 = None
#                 mse = None
#                 print(f"Accuracy: {accuracy}, F1 Score: {f1}")
#         # Semi-Supervised/Unsupervised Example
#         elif request.model_type == "kmeans":
#             print("Training unsupervised model: KMeans")
#             X = df.copy()
#             model = KMeans(n_clusters=3, random_state=42)
#             model.fit(X)

#             print("KMeans model training complete.")

#             accuracy = None
#             f1 = None

#         else:
#             print("Unsupported model type:", request.model_type)
#             raise HTTPException(status_code=400, detail="Unsupported model type")

#         # Save trained model
#         model_path = os.path.join(MODELS_FOLDER, f"{request.upload_id}_{request.model_type}.pkl")
#         joblib.dump(model, model_path)
#         print("Model saved at:", model_path)

#         return {
#             "message": "Model trained successfully",
#             "accuracy": accuracy,
#             "f1_score": f1,
#             "r2_score": r2,
#             "mse": mse,
#             "model_path": model_path
#         }


#     except Exception as e:
#         print("Error occurred:", str(e))  # <-- Super important
#         raise HTTPException(status_code=500, detail=str(e))

# ... Same imports + add these
import logging
import os
import pandas as pd
import joblib
import numpy as np
from fastapi import HTTPException
from sklearn.model_selection import KFold, GridSearchCV, RandomizedSearchCV
from sklearn.metrics import accuracy_score, f1_score, r2_score, mean_squared_error, roc_auc_score
import shap
import optuna
import autokeras as ak
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from pydantic import BaseModel
from datetime import datetime, timezone
import json
# Make sure to import this correctly

# Configure the logger
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Default hyperparameters for each model type
DEFAULT_HYPERPARAMETERS = {
    "logistic_regression": {
        'C': [0.001, 0.01, 0.1, 1, 10],
        'solver': ['lbfgs', 'liblinear'],
        'max_iter': [100, 1000]
    },
    "random_forest_classifier": {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 20, 30, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'bootstrap': [True, False]
    },
    "random_forest_regressor": {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 20, 30, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'bootstrap': [True, False]
    },
    "linear_regression": {},
    "decision_tree": {
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
}
import math

def sanitize_data(data):
    if isinstance(data, dict):
        return {key: sanitize_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif isinstance(data, float):
        if math.isnan(data) or math.isinf(data):
            return None  # Or use a default value like 0
    return data
class TrainRequest(BaseModel):
    upload_id: str
    model_type: str  # logistic_regression, random_forest, etc
    target_column: str = None
    tuner_type: str = "none"  # none, grid_search, random_search, bayesian_optimization
    automl: bool = False
    custom_hyperparams: dict = None
from ..utils.auth import get_current_user
from fastapi import APIRouter, Depends
import glob
@router.post("/")
async def train_model(request: TrainRequest,current_user: dict = Depends(get_current_user)):
    try:
        logger.info("Received training request for upload_id: %s", request.upload_id)
        
        # 1. Load data
        username = current_user["username"]
        clean_dir = os.path.join(os.path.dirname(__file__), "clean", username)
        logger.info("Looking for cleaned data in: %s", clean_dir)
        # Use glob to find the file ending with __<upload_id>.csv
        pattern = os.path.join(clean_dir, f"*__{request.upload_id}.csv")
        matched_files = glob.glob(pattern)

        if not matched_files:
            logger.error("Cleaned data not found for upload_id: %s", request.upload_id)
            raise HTTPException(status_code=404, detail="Cleaned data not found")

        file_path = matched_files[0]  # Take the first matched file
        logger.info("Loading data from: %s", file_path)
        df = pd.read_csv(file_path)

        # 2. If AutoML requested
        if request.automl:
            logger.info("AutoML requested. Starting AutoML model training.")
            
            if request.target_column is None:
                logger.error("Target column required for AutoML")
                raise HTTPException(status_code=400, detail="Target column required for AutoML")
            
            X = df.drop(columns=[request.target_column])
            y = df[request.target_column]
            
            clf = ak.StructuredDataClassifier(max_trials=5, overwrite=True)
            clf.fit(X, y, epochs=10)
            model_path = os.path.join(MODELS_FOLDER, f"{request.upload_id}_automl_model")
            
            logger.info("Exporting AutoML model to: %s", model_path)
            clf.export_model().save(model_path)
            return {"message": "AutoML model trained successfully", "model_path": model_path}

        # 3. Proceed with selected model
        if request.model_type not in ["logistic_regression", "random_forest_classifier", "random_forest_regressor", "linear_regression", "decision_tree", "kmeans"]:
            logger.error("Unsupported model type: %s", request.model_type)
            raise HTTPException(status_code=400, detail="Unsupported model type")

        if request.model_type == "kmeans":
            logger.info("Training KMeans model")
            X = df.copy()
            model = KMeans(n_clusters=3, random_state=42)
            model.fit(X)
            model_path = os.path.join(MODELS_FOLDER, f"{request.upload_id}_kmeans.pkl")
            joblib.dump(model, model_path)
            return {"message": "KMeans model trained", "model_path": model_path}

        # Supervised models
        if request.target_column is None or request.target_column not in df.columns:
            logger.error("Target column missing or invalid: %s", request.target_column)
            raise HTTPException(status_code=400, detail="Target column required for supervised models")

        logger.info("Preparing data for supervised model")
        X = df.drop(columns=[request.target_column])
        y = df[request.target_column]

        # Model selection
        logger.info("Selected model: %s", request.model_type)
        if request.model_type == "logistic_regression":
            base_model = LogisticRegression(max_iter=1000)
        elif request.model_type == "random_forest_classifier":
            base_model = RandomForestClassifier(random_state=42)
        elif request.model_type == "random_forest_regressor":
            base_model = RandomForestRegressor(random_state=42)
        elif request.model_type == "linear_regression":
            base_model = LinearRegression()
        else:
            base_model = DecisionTreeClassifier()

        # 4. Hyperparameter Tuning
        if request.tuner_type != "none":
            logger.info("Hyperparameter tuning requested: %s", request.tuner_type)
            
            if not request.custom_hyperparams:
                # Use default hyperparameters if custom ones are not provided
                request.custom_hyperparams = DEFAULT_HYPERPARAMETERS.get(request.model_type, {})
                logger.info("Using default hyperparameters: %s", request.custom_hyperparams)

            # Select the tuning method
            if request.tuner_type == "grid_search":
                tuner = GridSearchCV(base_model, request.custom_hyperparams, cv=5, n_jobs=-1)
            elif request.tuner_type == "random_search":
                tuner = RandomizedSearchCV(base_model, request.custom_hyperparams, n_iter=10, cv=5, n_jobs=-1)
            elif request.tuner_type == "bayesian_optimization":
                logger.info("Using Bayesian optimization with Optuna for hyperparameter tuning")
                def objective(trial):
                    params = {k: trial.suggest_categorical(k, v) if isinstance(v, list) else v for k,v in request.custom_hyperparams.items()}
                    model = type(base_model)(**params)
                    kf = KFold(n_splits=5)
                    scores = []
                    for train_idx, test_idx in kf.split(X):
                        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
                        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
                        model.fit(X_train, y_train)
                        preds = model.predict(X_test)
                        if isinstance(model, RandomForestRegressor) or isinstance(model, LinearRegression):
                            scores.append(mean_squared_error(y_test, preds))
                        else:
                            scores.append(f1_score(y_test, preds, average='weighted'))
                    return np.mean(scores)
                
                study = optuna.create_study()
                study.optimize(objective, n_trials=20)
                best_params = study.best_params
                base_model.set_params(**best_params)
                tuner = base_model
            else:
                logger.error("Unsupported tuner: %s", request.tuner_type)
                raise HTTPException(status_code=400, detail="Unsupported tuner")

            model = tuner.fit(X, y)
        else:
            model = base_model.fit(X, y)

        # 5. Cross-validation
        logger.info("Performing cross-validation")
        kf = KFold(n_splits=5)
        metrics = {
            "accuracy": [],
            "f1_score": [],
            "r2_score": [],
            "mse": [],
            "auc_roc": []
        }

        for train_idx, test_idx in kf.split(X):
            X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
            y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

            # Skip fold if only one class is present in y_test
            if len(np.unique(y_test)) == 1:
                logger.warning("Only one class present in the test set, skipping fold.")
                continue

            model.fit(X_train, y_train)

            if hasattr(model, "best_estimator_"):
                estimator = model.best_estimator_
            else:
                estimator = model

            preds = estimator.predict(X_test)
            logger.info(model)
            if hasattr(estimator, "predict_proba"):
                logger.info("Calculating AUC-ROC")
                proba = estimator.predict_proba(X_test)[:, 1]
                metrics["auc_roc"].append(roc_auc_score(y_test, proba))

            if isinstance(estimator, RandomForestRegressor) or isinstance(estimator, LinearRegression):
                logger.info("Calculating regression metrics")
                metrics["r2_score"].append(r2_score(y_test, preds))
                metrics["mse"].append(mean_squared_error(y_test, preds))
            else:
                logger.info("Calculating classification metrics")
                if len(np.unique(y_test)) > 1:  # Ensure multiple classes
                    metrics["accuracy"].append(accuracy_score(y_test, preds))
                    metrics["f1_score"].append(f1_score(y_test, preds, average='weighted'))


        # 6. Explainability
        # logger.info("Generating SHAP explanation")
        # explainer = shap.Explainer(model, X)
        # shap_values = explainer(X)
        # shap.summary_plot(shap_values, X, show=False)
        # shap_plot_path = os.path.join(MODELS_FOLDER, f"{request.upload_id}_shap.png")
        # import matplotlib.pyplot as plt
        # plt.savefig(shap_plot_path)
        # plt.close()

        # Save model
        # logger.info("Saving model to: %s", model_path)
        username = current_user["username"]
        model_dir = os.path.join(os.path.dirname(__file__), "models", username)
        os.makedirs(model_dir, exist_ok=True)

        # Save using filename__upload_id_modeltype.pkl for clarity
        model_filename = f"{request.upload_id}_{request.model_type}.pkl"
        model_path = os.path.join(model_dir, model_filename)
        joblib.dump(model, model_path)
        logger.info("Model path: %s", model_path)
        logger.info("Model saved successfully")
        logger.info("Metrics: %s", metrics)
        metrics={k: (sum(v)/len(v) if len(v) > 0 else 0) for k, v in metrics.items()}
        cleaned_data = sanitize_data(metrics)
        logger.info("Cleaned metrics: %s", cleaned_data)
        # Then return this cleaned data
        # return JSONResponse(content=cleaned_data)
        metadata = {
            "model_name": base_model.__class__.__name__,
            "upload_id": request.upload_id,
            "model_type": request.model_type,
            "username": username,
            "trained_at": datetime.now(timezone.utc).isoformat(),
            "metrics": metrics,
            "model_path": model_path,
            "tuner_type": request.tuner_type,
            "automl": request.automl,
            "shap_plot_path": None  # Replace with actual path if SHAP used
        }

        # Save metadata JSON
        # metadata_path = os.path.join(model_dir, f"{request.upload_id}_{request.model_type}_metadata.json")
        # with open(metadata_path, "w") as f:
        #     json.dump(metadata, f, indent=4)
        # Save metadata under model_metadata/<username>
        metadata_dir = os.path.join(os.path.dirname(__file__), "model_metadata", username)
        os.makedirs(metadata_dir, exist_ok=True)

        metadata_filename = f"{request.upload_id}_{request.model_type}_metadata.json"
        metadata_path = os.path.join(metadata_dir, metadata_filename)

        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=4)

        # Get the base directory of the current file (inside api/)
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        # Build the correct path to dataset_metadata
        dataset_metadata_path = os.path.join(
            BASE_DIR, "dataset_metadata", username, f"{request.upload_id}_metadata.json"
        )

        # Check if metadata file exists and update it
        if os.path.exists(dataset_metadata_path):
            with open(dataset_metadata_path, "r") as f:
                dataset_meta = json.load(f)

            # Add model reference
            model_ref = {
                "model_type": request.model_type,
                "model_path": model_path,
                "trained_at": datetime.now(timezone.utc).isoformat()
            }
            dataset_meta["linked_models"].append(model_ref)

            with open(dataset_metadata_path, "w") as f:
                json.dump(dataset_meta, f, indent=4)

        return {
            "message": "Model trained successfully",
            "metrics": cleaned_data,
            "model_path": model_path,
            # "shap_plot_path": shap_plot_path
        }

    except Exception as e:
        logger.error("Training failed: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

