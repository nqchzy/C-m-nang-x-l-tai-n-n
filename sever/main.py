from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
try:
    from sever.api import router as api_router
except ModuleNotFoundError:
    from api import router as api_router
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
try:
    app.mount("/data", StaticFiles(directory="data"), name="data")
except RuntimeError:
    app.mount("/data", StaticFiles(directory="sever/data"), name="data")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
