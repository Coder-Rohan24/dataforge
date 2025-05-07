from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from ..db.mongo import user_collection
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # 'token' is your login endpoint

load_dotenv()
SECRET_KEY = "7487d6ed8d3c72d020ca7a2e2ee2abf7db2454db7475824cd0dd756cc461edd1"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed):
    return pwd_context.verify(plain_password, hashed)

def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, "7487d6ed8d3c72d020ca7a2e2ee2abf7db2454db7475824cd0dd756cc461edd1", algorithm="HS256")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = await user_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Derive username from email if name is not present
        username = email.split("@")[0]
        return {"email": email, "username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
