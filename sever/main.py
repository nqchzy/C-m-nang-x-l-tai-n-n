from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
<<<<<<< HEAD
try:
    from sever.api import router as api_router
except ModuleNotFoundError:
    from api import router as api_router
    
=======

from api import router as api_router

# Đường dẫn tuyệt đối tới thư mục server
BASE_DIR = Path(__file__).resolve().parent

>>>>>>> fee7405ffe038caafd3fd35563fc86aba5054302
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
app.include_router(api_router)
<<<<<<< HEAD
try:
    app.mount("/data", StaticFiles(directory="data"), name="data")
except RuntimeError:
    app.mount("/data", StaticFiles(directory="sever/data"), name="data")
=======

# Serve thư mục data
app.mount(
    "/data",
    StaticFiles(directory=str(BASE_DIR / "data")),
    name="data"
)

# Serve frontend
app.mount(
    "/",
    StaticFiles(
        directory=str(BASE_DIR.parent / "frontend"),
        html=True
    ),
    name="frontend"
)
>>>>>>> fee7405ffe038caafd3fd35563fc86aba5054302

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )