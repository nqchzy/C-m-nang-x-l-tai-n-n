from fastapi import APIRouter, HTTPException, status
from pathlib import Path
import json
from models import LoginRequest, RegisterRequest

router = APIRouter()

DATA_FILE = Path(__file__).parent / "data" / "login.json"

def load_users():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

@router.post("/login", status_code=status.HTTP_200_OK)
def login(req: LoginRequest):
    users = load_users()
    user = users.get(req.username)
    if not user or str(user.get("pass")) != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    # Return user info (excluding password)
    return {
        "msg": "Login successful",
        "username": req.username,
        "name": user.get("name", ""),
        "email": req.username,  # assuming username is email
        "sdt": user.get("sdt", "")
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    users = load_users()
    if req.username in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    users[req.username] = {
        "name": req.name,
        "pass": req.password
    }
    save_users(users)
    return {"msg": "User registered"}