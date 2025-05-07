# from pydantic import BaseModel, EmailStr
# # models/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# class DatasetMetadata(BaseModel):
#     dataset_id: str = Field(default_factory=lambda: str(uuid4()))
#     name: str
#     upload_id: str
#     columns: List[str]
#     preview: Optional[dict]
#     status: str = "uploaded"  # uploaded, preprocessed, trained
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     file_path: Optional[str] = None  # For legacy support
#     file_id: Optional[str] = None  # If using GridFS

# class TrainedModel(BaseModel):
#     model_id: str = Field(default_factory=lambda: str(uuid4()))
#     dataset_id: str
#     model_name: str
#     model_type: str  # xgboost, randomforest, cnn, etc
#     file_id: Optional[str]
#     status: str = "trained"
#     metrics: Optional[dict] = None
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     deployed: bool = False

# class User(BaseModel):
#     id: str = Field(default_factory=lambda: str(uuid4()))
#     name: str
#     email: EmailStr
#     password: str
#     datasets: List[DatasetMetadata] = []
#     models: List[TrainedModel] = []
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: datetime = Field(default_factory=datetime.utcnow)