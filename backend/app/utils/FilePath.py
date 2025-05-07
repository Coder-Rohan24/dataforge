import os
from fastapi import APIRouter, HTTPException, File, UploadFile


from ..utils.auth import get_current_user
def get_file_path(upload_id: str, username: str) -> str:
    user_tmp_dir = os.path.join(os.path.dirname(__file__), "tmp", username)

    if not os.path.exists(user_tmp_dir):
        raise HTTPException(status_code=404, detail=f"No files found for user '{username}'")

    for filename in os.listdir(user_tmp_dir):
        if filename.split("_")[-1].startswith(upload_id):  # Match the UUID part
            return os.path.join(user_tmp_dir, filename)

    raise HTTPException(status_code=404, detail=f"File with upload_id '{upload_id}' not found for user '{username}'")
