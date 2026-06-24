from pydantic import BaseModel

__all__ = "LoginRequest", "RegisterRequest"

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str = ""