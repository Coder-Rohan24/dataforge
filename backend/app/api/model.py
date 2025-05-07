from fastapi import Depends
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
from fastapi import APIRouter, HTTPException
import os
from datetime import datetime
from ..utils.auth import get_current_user
import json
router = APIRouter()
import logging
# from datetime import datetime

# @router.get("/models")
# async def list_user_models(current_user: dict = Depends(get_current_user)):
#     username = current_user["username"]
#     model_dir=os.path.join(os.path.dirname(__file__), "dataset_metadata")
#     model_metadata_dir = os.path.join(model_dir, username)
#     # model_metadata_dir = os.path.join("C:\\Users\\HP\\OneDrive\\Desktop\\Data\\DataForge\\backend\\app\\api\\model_metadata", username)

#     if not os.path.exists(model_metadata_dir):
#         return []

#     models = []
#     for fname in os.listdir(model_metadata_dir):
#         if fname.endswith(".json"):
#             try:
#                 with open(os.path.join(model_metadata_dir, fname), 'r') as f:
#                     meta = json.load(f)

#                 metrics = meta.get("metrics", {})
#                 upload_id = meta.get("upload_id", "")
#                 trained_at = meta.get("trained_at", "")
#                 model_name = meta.get("model_name", "Unknown Model")
#                 model_type = meta.get("model_type", "unknown")

#                 models.append({
#                     "upload_id": upload_id,
#                     "name": model_name,
#                     "status": "Trained",
#                     "accuracy": round(metrics.get("accuracy", 0.0) * 100, 2),
#                     "f1_score": round(metrics.get("f1_score", 0.0), 3),
#                     "auc_roc": round(metrics.get("auc_roc", 0.0), 3),
#                     "trained_at": datetime.fromisoformat(trained_at).strftime('%Y-%m-%d'),
#                     "model_type": model_type,
#                     "model_path": meta.get("model_path", "")
#                 })
#             except Exception as e:
#                 print(f"Error parsing model metadata {fname}: {e}")
#                 continue

#     return JSONResponse(content=models)

# @router.get("/models")
# async def list_user_models(current_user: dict = Depends(get_current_user)):
#     username = current_user["username"]
#     # Use correct model_metadata path
#     model_dir=os.path.join(os.path.dirname(__file__), "model_metadata")
#     model_metadata_dir = os.path.join(model_dir, username)
#     # model_metadata_dir = os.path.join(
#     #     "C:\\Users\\HP\\OneDrive\\Desktop\\Data\\DataForge\\backend\\app\\api\\model_metadata", username)

#     if not os.path.exists(model_metadata_dir):
#         return []

#     models = []
#     for fname in os.listdir(model_metadata_dir):
#         if fname.endswith("_metadata.json"):
#             try:
#                 with open(os.path.join(model_metadata_dir, fname), 'r') as f:
#                     meta = json.load(f)

#                 metrics = meta.get("metrics", {})
#                 upload_id = meta.get("upload_id", "")
#                 trained_at = meta.get("trained_at", "")
#                 model_name = meta.get("model_name", "Unknown Model")
#                 model_type = meta.get("model_type", "unknown")

#                 models.append({
#                     "upload_id": upload_id,
#                     "name": model_name,
#                     "status": "Trained",
#                     "accuracy": round(metrics.get("accuracy", 0.0) * 100, 2),
#                     "f1_score": round(metrics.get("f1_score", 0.0), 3),
#                     "auc_roc": round(metrics.get("auc_roc", 0.0), 3),
#                     "trained_at": datetime.fromisoformat(trained_at).strftime('%Y-%m-%d'),
#                     "model_type": model_type,
#                     "model_path": meta.get("model_path", "")
#                 })
#             except Exception as e:
#                 print(f"Error parsing model metadata {fname}: {e}")
#                 continue

#     return JSONResponse(content=models)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@router.get("/models")
async def list_user_models(current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    logger.info(f"Fetching models for user: {username}")

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    model_metadata_dir = os.path.join(BASE_DIR, "model_metadata", username)
    logger.debug(f"Model metadata directory: {model_metadata_dir}")

    if not os.path.exists(model_metadata_dir):
        logger.warning(f"No model metadata found for user: {username}")
        return []

    models = []
    for fname in os.listdir(model_metadata_dir):
        if fname.endswith("_metadata.json"):
            try:
                file_path = os.path.join(model_metadata_dir, fname)
                logger.info(f"Reading model metadata: {file_path}")
                with open(file_path, 'r') as f:
                    meta = json.load(f)

                upload_id = meta.get("upload_id", "")
                model_name = meta.get("model_name", "Unknown Model")
                model_type = meta.get("model_type", "unknown")
                trained_at_raw = meta.get("trained_at", "")
                
                try:
                    trained_at = datetime.fromisoformat(trained_at_raw).strftime('%Y-%m-%d')
                except Exception as e:
                    logger.warning(f"Invalid 'trained_at' format in {fname}: {trained_at_raw}")
                    trained_at = "Unknown"

                metrics = meta.get("metrics", {})

                models.append({
                    "upload_id": upload_id,
                    "name": model_name,
                    "status": "Trained",
                    "accuracy": round(metrics.get("accuracy", 0.0) * 100, 2),
                    "f1_score": round(metrics.get("f1_score", 0.0), 3),
                    "auc_roc": round(metrics.get("auc_roc", 0.0), 3),
                    "trained_at": trained_at_raw,
                    "model_type": model_type,
                    "model_path": meta.get("model_path", "")
                })

                logger.debug(f"Loaded model metadata for: {upload_id}")
            except Exception as e:
                logger.error(f"Failed to parse metadata file {fname}: {e}", exc_info=True)
                continue

    logger.info(f"Total models returned for user {username}: {len(models)}")
    return JSONResponse(content=models)

