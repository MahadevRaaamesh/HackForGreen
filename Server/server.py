from fastapi import FastAPI, File, UploadFile, Form
import uvicorn

app = FastAPI()

@app.post("/upload")
async def upload(
    image: UploadFile = File(...),
    timestamp: str = Form(...),
    detections: str = Form(...)
):
    print("Timestamp:", timestamp)
    print("Detections:", detections)
    return {"status": "received"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)