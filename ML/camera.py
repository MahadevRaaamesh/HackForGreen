from ultralytics import YOLO
import cv2

def main():
    model = YOLO("../runs/detect/train6/weights/best.pt")
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)

        annotated = results[0].plot()
        cv2.imshow("Trash Detection", annotated)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
