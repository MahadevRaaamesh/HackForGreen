import cv2
import requests
import time
from ultralytics import YOLO

model = YOLO("best.pt")
SERVER_URL = "http://localhost:8000/upload"

def main():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Camera not accessible")
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)

            detections = []
            for box in results[0].boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                label = model.names[cls_id]

                detections.append({
                    "label": label,
                    "confidence": conf
                })

            if any(d["label"] == "trash" for d in detections):
                _, img_encoded = cv2.imencode(".jpg", frame)

                files = {
                    "image": ("frame.jpg", img_encoded.tobytes(), "image/jpeg")
                }

                data = {
                    "timestamp": str(time.time()),
                    "detections": str(detections)
                }

                requests.post(SERVER_URL, files=files, data=data)

            annotated = results[0].plot()
            cv2.imshow("Live Feed", annotated)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    except KeyboardInterrupt:
        print("\nShutting down gracefully...")

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("Resources released. Exit complete.")

if __name__ == "__main__":
    main()
