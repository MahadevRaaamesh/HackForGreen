from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="Dataset/data.yaml",
    epochs=50,
    imgsz=640,
    device=0
)
