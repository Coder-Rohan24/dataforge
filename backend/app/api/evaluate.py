from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle
from pathlib import Path
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    roc_auc_score,
    mean_squared_error,
    mean_absolute_error,
    r2_score
)
from app.core.config import settings

router = APIRouter()

class EvaluateRequest(BaseModel):
    model_path: str
    test_data_path: str
    target_column: str
    problem_type: str  # "classification" or "regression"

@router.post("/")
def evaluate_model(payload: EvaluateRequest):
    try:
        model_file = Path(payload.model_path)
        data_file = Path(payload.test_data_path)

        if not model_file.exists() or not data_file.exists():
            raise HTTPException(status_code=404, detail="Model or dataset file not found")

        with open(model_file, "rb") as f:
            model = pickle.load(f)

        df = pd.read_csv(data_file)

        if payload.target_column not in df.columns:
            raise HTTPException(status_code=400, detail="Target column not in dataset")

        X = df.drop(columns=[payload.target_column])
        y = df[payload.target_column]

        y_pred = model.predict(X)

        metrics = {}

        if payload.problem_type == "classification":
            metrics["classification_report"] = classification_report(y, y_pred, output_dict=True)
            metrics["confusion_matrix"] = confusion_matrix(y, y_pred).tolist()
            try:
                metrics["f1_score"] = f1_score(y, y_pred, average="weighted")
                metrics["roc_auc"] = roc_auc_score(y, model.predict_proba(X), multi_class='ovr')
            except:
                pass  # e.g., if binary or no probas available
        elif payload.problem_type == "regression":
            metrics["rmse"] = mean_squared_error(y, y_pred, squared=False)
            metrics["mae"] = mean_absolute_error(y, y_pred)
            metrics["r2"] = r2_score(y, y_pred)
        else:
            raise HTTPException(status_code=400, detail="Invalid problem type")

        return {"message": "Model evaluation complete", "metrics": metrics}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {e}")
