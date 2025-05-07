from fastapi import APIRouter, HTTPException
from ..models.user import UserCreate, UserLogin
from ..db.mongo import user_collection
from ..utils.auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/signup")
async def signup(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    hashed = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed
    }
    await user_collection.insert_one(new_user)
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer","message": "Signup successful"}
    

@router.post("/login")
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
