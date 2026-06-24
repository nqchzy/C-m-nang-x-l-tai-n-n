from pathlib import Path
import json
from typing import Dict, Any, Optional

DATA_FILE = Path(__file__).parent / "data" / "login.json"

def load_users() -> Dict[str, Any]:
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_users(users: Dict[str, Any]) -> None:
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

def authenticate_user(username: str, password: str) -> bool:
    users = load_users()
    user = users.get(username)
    if not user:
        return False
    # Convert stored password to string for comparison (handles int values)
    return str(user.get("pass")) == password

def register_user(username: str, password: str, name: str = "") -> bool:
    users = load_users()
    if username in users:
        return False
    users[username] = {
        "name": name,
        "pass": password
    }
    save_users(users)
    return True