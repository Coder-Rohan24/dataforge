from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import ingest, preprocess, train, evaluate, auth, dataset,model

app = FastAPI(
    title="DataForge ML Platform",
    description="Full ML pipeline - ingest, clean, train, tune, evaluate & deploy",
    version="1.0.0"
)

# Allow CORS (Frontend on localhost:5173 or Vercel etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 👈 frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(ingest.router, prefix="/api/ingest", tags=["Ingestion"])
app.include_router(dataset.router, prefix="/api/dataset", tags=["Dataset"])
app.include_router(model.router, prefix="/api/model", tags=["Model"])
app.include_router(preprocess.router, prefix="/api/preprocess", tags=["Preprocessing"])
app.include_router(train.router, prefix="/api/train", tags=["Training"])
app.include_router(evaluate.router, prefix="/api/evaluate", tags=["Evaluation"])
# app.include_router(deploy.router, prefix="/api/deploy", tags=["Deployment"])
