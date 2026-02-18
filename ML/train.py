from ultralytics import YOLO

def main():
    model = YOLO("yolov8s.pt")
    model.train(
        data="Dataset/data.yaml",
        epochs=50,
        imgsz=640,
        device=0
    )

if __name__ == "__main__":
    main()