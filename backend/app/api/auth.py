from fastapi import APIRouter, HTTPException, Request
from ..models.user import UserCreate, UserLogin
from ..db.mongo import user_collection
from ..utils.auth import hash_password, verify_password, create_access_token
from jose import JWTError, jwt
SECRET_KEY="7487d6ed8d3c72d020ca7a2e2ee2abf7db2454db7475824cd0dd756cc461edd1"
ALGORITHM="HS256"
from fastapi.security import OAuth2PasswordBearer

from pydantic import BaseModel

class UserUpdateRequest(BaseModel):
    name: str
    email:str
    
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
@router.get("/user/profile")
async def get_user_profile(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")
    
    token = token.replace("Bearer ", "")  # Clean the prefix

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = await user_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        username = user.get("name") or email.split("@")[0]
        return {"email": email, "name": username}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.put("/user/profile")
async def update_user_profile(request: Request, payload: UserUpdateRequest):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    token = token.replace("Bearer ", "")

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = decoded.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        result = await user_collection.update_one(
            {"email": email},
            {"$set": {"name": payload.name}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Update failed or no changes made")

        return {"message": "Profile updated successfully"}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
