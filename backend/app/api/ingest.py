# backend/app/api/ingest.py
# from fastapi import APIRouter, UploadFile, File, Form, HTTPException
# from pydantic import BaseModel
# import pandas as pd
# import json
# from io import BytesIO
# import sqlalchemy
# from pymongo import MongoClient
# import requests
# from kafka import KafkaConsumer
# import threading
# import os
# from fastapi import UploadFile
# import uuid

# router = APIRouter()


# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         contents = await file.read()
#         if file.filename.endswith(".csv"):
#             df = pd.read_csv(BytesIO(contents))
#         elif file.filename.endswith(".json"):
#             df = pd.read_json(BytesIO(contents))
#         else:
#             raise HTTPException(status_code=400, detail="Unsupported file type.")

#         # Save the dataframe in memory or temp file
#         upload_id = str(uuid.uuid4())
#         # df.to_pickle(f"/tmp/{upload_id}.pkl")  # Save using Pickle
#         tmp_dir = os.path.join(os.path.dirname(__file__), "tmp")  # Refers to app/tmp

#         # Ensure the tmp directory exists
#         os.makedirs(tmp_dir, exist_ok=True)

#         # Assuming you already have df = pd.read_csv(upload_file.file)
#         csv_path = os.path.join(tmp_dir, f"{upload_id}.csv")
#         df.to_csv(csv_path, index=False)
#         return {
#             "status": "success",
#             "upload_id": upload_id,
#             "columns": df.columns.tolist(),
#             # "preview": df.head().to_dict()"preview": df.head().fillna(None).to_dict()
#             "preview": json.loads(df.head().to_json(orient="columns", default_handler=str))

#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# api/ingest.py
# from bson import ObjectId
# from ..db.mongo import user_collection, fs
# from fastapi import Depends

# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...), user_id: str = Form(...)):
#     contents = await file.read()
#     upload_id = str(uuid.uuid4())
    
#     if file.filename.endswith(".csv"):
#         df = pd.read_csv(BytesIO(contents))
#     elif file.filename.endswith(".json"):
#         df = pd.read_json(BytesIO(contents))
#     else:
#         raise HTTPException(status_code=400, detail="Unsupported file type.")

#     # Save file in GridFS
#     file_id = fs.put(contents, filename=file.filename, content_type=file.content_type)

#     metadata = {
#         "dataset_id": str(uuid.uuid4()),
#         "name": file.filename,
#         "upload_id": upload_id,
#         "columns": df.columns.tolist(),
#         "preview": json.loads(df.head().to_json(orient="columns")),
#         "status": "uploaded",
#         "created_at": datetime.utcnow(),
#         "file_id": str(file_id)
#     }

#     result = await user_collection.update_one(
#         {"_id": ObjectId(user_id)},
#         {"$push": {"datasets": metadata}},
#         upsert=True
#     )

#     return {
#         "status": "success",
#         "upload_id": upload_id,
#         "columns": df.columns.tolist(),
#         "preview": metadata["preview"]
#     }

### 2️⃣ SQL Ingestion
# class SQLRequest(BaseModel):
#     dialect: str  # e.g., 'postgresql', 'mysql', 'sqlite'
#     username: str
#     password: str
#     host: str
#     port: str
#     database: str
#     query: str

# @router.post("/sql")
# async def ingest_sql(data: SQLRequest):
#     try:
#         uri = f"{data.dialect}://{data.username}:{data.password}@{data.host}:{data.port}/{data.database}"
#         engine = sqlalchemy.create_engine(uri)
#         df = pd.read_sql(data.query, engine)
#         return {"columns": df.columns.tolist(), "preview": df.head().to_dict()}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# ### 3️⃣ NoSQL (MongoDB) Ingestion
# class NoSQLRequest(BaseModel):
#     mongo_uri: str
#     db_name: str
#     collection_name: str

# @router.post("/nosql")
# async def ingest_nosql(data: NoSQLRequest):
#     try:
#         client = MongoClient(data.mongo_uri)
#         collection = client[data.db_name][data.collection_name]
#         docs = list(collection.find().limit(100))
#         df = pd.DataFrame(docs)
#         return {"columns": df.columns.tolist(), "preview": df.head().to_dict()}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# ### 4️⃣ API-based Ingestion
# class APIRequest(BaseModel):
#     url: str
#     headers: dict = {}

# @router.post("/api")
# async def ingest_api(data: APIRequest):
#     try:
#         res = requests.get(data.url, headers=data.headers)
#         json_data = res.json()
#         df = pd.json_normalize(json_data)
#         return {"columns": df.columns.tolist(), "preview": df.head().to_dict()}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# ### 5️⃣ Kafka Real-time Streaming
# kafka_data = []

# def consume_kafka(broker: str, topic: str):
#     consumer = KafkaConsumer(
#         topic,
#         bootstrap_servers=broker,
#         auto_offset_reset='latest',
#         enable_auto_commit=True,
#         value_deserializer=lambda x: json.loads(x.decode('utf-8'))
#     )
#     for message in consumer:
#         kafka_data.append(message.value)
#         if len(kafka_data) >= 10:
#             break

# class KafkaRequest(BaseModel):
#     broker: str
#     topic: str

# @router.post("/kafka")
# async def ingest_kafka(data: KafkaRequest):
#     try:
#         kafka_data.clear()
#         thread = threading.Thread(target=consume_kafka, args=(data.broker, data.topic))
#         thread.start()
#         thread.join(timeout=10)

#         if kafka_data:
#             df = pd.DataFrame(kafka_data)
#             return {"columns": df.columns.tolist(), "preview": df.head().to_dict()}
#         else:
#             raise HTTPException(status_code=404, detail="No data received from Kafka.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Depends
from typing import Dict, Any
import pandas as pd
import os, uuid, json
from io import BytesIO
from pymongo import MongoClient
import sqlalchemy
from ..utils.auth import get_current_user
router = APIRouter()
TMP_DIR = os.path.join(os.path.dirname(__file__), "tmp")
os.makedirs(TMP_DIR, exist_ok=True)


# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         contents = await file.read()
#         if file.filename.endswith(".csv"):
#             df = pd.read_csv(BytesIO(contents))
#         elif file.filename.endswith(".json"):
#             df = pd.read_json(BytesIO(contents))
#         else:
#             raise HTTPException(status_code=400, detail="Unsupported file type.")

#         upload_id = str(uuid.uuid4())
#         df.to_csv(os.path.join(TMP_DIR, f"{upload_id}.csv"), index=False)

#         return {
#             "status": "success",
#             "upload_id": upload_id,
#             "columns": df.columns.tolist(),
#             "preview": json.loads(df.head().to_json(orient="columns", default_handler=str))
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
from datetime import datetime,timezone
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        contents = await file.read()

        if file.filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        elif file.filename.endswith(".json"):
            df = pd.read_json(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        username = current_user["username"]
        upload_id = str(uuid.uuid4())

        # Get original filename without extension
        original_name = os.path.splitext(file.filename)[0]

        # Create user-specific directory
        user_dir = os.path.join(TMP_DIR, username)
        os.makedirs(user_dir, exist_ok=True)

        # Save file as <original_filename>__<uuid>.csv
        filename = f"{original_name}__{upload_id}.csv"
        file_path = os.path.join(user_dir, filename)
        df.to_csv(file_path, index=False)
        # Save dataset metadata
        dataset_metadata = {
            "upload_id": upload_id,
            "original_name": original_name,
            "username": username,
            "upload_time": datetime.now(timezone.utc).isoformat(),
            "columns": df.columns.tolist(),
            "linked_models": []  # Initially empty
        }

        # Get the base directory of the current file (inside api/)
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        # Define dataset metadata path inside api/dataset_metadata/<username>
        metadata_dir = os.path.join(BASE_DIR, "dataset_metadata", username)
        os.makedirs(metadata_dir, exist_ok=True)

        metadata_path = os.path.join(metadata_dir, f"{upload_id}_metadata.json")

        # Save dataset metadata
        with open(metadata_path, "w") as f:
            json.dump(dataset_metadata, f, indent=4)

        return {
            "status": "success",
            "upload_id": upload_id,
            "filename": original_name,
            "columns": df.columns.tolist(),
            "preview": json.loads(df.head().to_json(orient="columns", default_handler=str))
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
@router.post("/upload-sql")
async def upload_sql(payload: Dict[str, Any] = Body(...)):
    try:
        conn_str = payload.get("connection_string")
        query = payload.get("query")
        if not conn_str or not query:
            raise HTTPException(status_code=400, detail="Missing connection string or query.")

        engine = sqlalchemy.create_engine(conn_str)
        df = pd.read_sql(query, engine)

        upload_id = str(uuid.uuid4())
        df.to_csv(os.path.join(TMP_DIR, f"{upload_id}.csv"), index=False)

        return {
            "status": "success",
            "upload_id": upload_id,
            "columns": df.columns.tolist(),
            "preview": json.loads(df.head().to_json(orient="columns", default_handler=str))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQL error: {str(e)}")


@router.post("/upload-mongo")
async def upload_mongo(payload: Dict[str, Any] = Body(...)):
    try:
        uri = payload.get("uri")
        db_name = payload.get("database")
        collection_name = payload.get("collection")
        if not uri or not db_name or not collection_name:
            raise HTTPException(status_code=400, detail="Missing MongoDB connection details.")

        client = MongoClient(uri)
        collection = client[db_name][collection_name]
        documents = list(collection.find({}, {'_id': False}))

        if not documents:
            raise HTTPException(status_code=404, detail="No documents found in collection.")

        df = pd.DataFrame(documents)
        upload_id = str(uuid.uuid4())
        df.to_csv(os.path.join(TMP_DIR, f"{upload_id}.csv"), index=False)

        return {
            "status": "success",
            "upload_id": upload_id,
            "columns": df.columns.tolist(),
            "preview": json.loads(df.head().to_json(orient="columns", default_handler=str))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB error: {str(e)}")


@router.post("/upload-api")
async def upload_from_api(payload: Dict[str, Any] = Body(...)):
    import requests

    try:
        url = payload.get("url")
        if not url:
            raise HTTPException(status_code=400, detail="API URL is required.")

        res = requests.get(url)
        if res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch from API.")

        data = res.json()

        # Convert list of dicts or dict of lists to DataFrame
        if isinstance(data, dict):
            df = pd.DataFrame.from_dict(data)
        elif isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            raise HTTPException(status_code=400, detail="Unsupported API data format.")

        upload_id = str(uuid.uuid4())
        df.to_csv(os.path.join(TMP_DIR, f"{upload_id}.csv"), index=False)

        return {
            "status": "success",
            "upload_id": upload_id,
            "columns": df.columns.tolist(),
            "preview": json.loads(df.head().to_json(orient="columns", default_handler=str))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API fetch error: {str(e)}")
