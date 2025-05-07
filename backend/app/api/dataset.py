from fastapi import Depends
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
from fastapi import APIRouter, HTTPException
import os
from datetime import datetime
from ..utils.auth import get_current_user
import json 
router = APIRouter()

TMP_DIR = os.path.join(os.path.dirname(__file__), "tmp")
os.makedirs(TMP_DIR, exist_ok=True)
CLEAN_DIR = os.path.join(os.path.dirname(__file__), "clean")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")


# def get_dataset_status(upload_id: str, username: str):
#     user_clean_dir = os.path.join(CLEAN_DIR, username)
#     if not os.path.exists(user_clean_dir):
#         return {"is_preprocessed": False, "is_trained": False}

#     # Match any file ending with __{uuid}.csv
#     for fname in os.listdir(user_clean_dir):
#         if fname.endswith(f"__{upload_id}.csv"):
#             return {
#                 "is_preprocessed": True,
#                 "is_trained": os.path.exists(os.path.join(MODELS_DIR, username, f"{upload_id}.pkl"))
#             }

#     return {"is_preprocessed": False, "is_trained": False}
def get_dataset_status(upload_id: str, username: str):
    user_clean_dir = os.path.join(CLEAN_DIR, username)
    user_model_dir = os.path.join(MODELS_DIR, username)

    if not os.path.exists(user_clean_dir):
        return {"is_preprocessed": False, "is_trained": False}

    # Check if preprocessed file exists
    is_preprocessed = any(
        fname.endswith(f"__{upload_id}.csv") for fname in os.listdir(user_clean_dir)
    )

    # Check if trained model exists (filename contains upload_id)
    is_trained = False
    if os.path.exists(user_model_dir):
        is_trained = any(
            upload_id in fname for fname in os.listdir(user_model_dir)
        )

    return {
        "is_preprocessed": is_preprocessed,
        "is_trained": is_trained
    }

# @router.get("/datasets")
# async def list_user_datasets(current_user: dict = Depends(get_current_user)):
#     username = current_user["username"]
#     user_dir = os.path.join(TMP_DIR, username)

#     if not os.path.exists(user_dir):
#         return []

#     datasets = []
#     for fname in os.listdir(user_dir):
#         if '__' in fname:
#             try:
#                 original_name, uuid_part = fname.rsplit('__', 1)
#                 uuid_str = uuid_part.replace(".csv", "").replace(".json", "")
#                 file_path = os.path.join(user_dir, fname)
#                 size = round(os.path.getsize(file_path) / (1024 * 1024), 2)  # MB
#                 uploaded = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d')

#                 status = get_dataset_status(uuid_str, username)

#                 datasets.append({
#                     "upload_id": uuid_str,
#                     "name": original_name,
#                     "size": f"{size}MB",
#                     "uploaded": uploaded,
#                     "filename": fname,
#                     "is_preprocessed": status["is_preprocessed"],
#                     "is_trained": status["is_trained"]
#                 })
#             except Exception:
#                 continue

#     return JSONResponse(content=datasets)
DATASET_METADATA_DIR = os.path.join(os.path.dirname(__file__), "dataset_metadata")
@router.get("/datasets")
async def list_user_datasets(current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    user_dir = os.path.join(TMP_DIR, username)
    metadata_dir = os.path.join(DATASET_METADATA_DIR, username)

    if not os.path.exists(user_dir):
        return []

    datasets = []
    for fname in os.listdir(user_dir):
        if '__' in fname:
            try:
                original_name, uuid_part = fname.rsplit('__', 1)
                uuid_str = uuid_part.replace(".csv", "").replace(".json", "")
                file_path = os.path.join(user_dir, fname)
                size = round(os.path.getsize(file_path) / (1024 * 1024), 2)
                uploaded = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d')

                status = get_dataset_status(uuid_str, username)

                # Match metadata file as {uuid}_metadata.json
                linked_models = []
                metadata_file = os.path.join(metadata_dir, f"{uuid_str}_metadata.json")
                if os.path.exists(metadata_file):
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                        linked_models = metadata.get("linked_models", [])

                datasets.append({
                    "upload_id": uuid_str,
                    "name": original_name,
                    "size": f"{size}MB",
                    "uploaded": uploaded,
                    "filename": fname,
                    "is_preprocessed": status["is_preprocessed"],
                    "is_trained": status["is_trained"],
                    "linked_models": linked_models
                })
            except Exception as e:
                print(f"Error reading dataset file {fname}: {e}")
                continue

    return JSONResponse(content=datasets)

@router.get("/download/{filename}")
async def download_file(filename: str, current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    file_path = os.path.join(TMP_DIR, username, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path, filename=filename, media_type="application/octet-stream")

@router.delete("/delete/{filename}")
async def delete_file(filename: str, current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    file_path = os.path.join(TMP_DIR, username, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    os.remove(file_path)
    return {"status": "success", "message": f"{filename} deleted."}
