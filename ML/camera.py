from ultralytics import YOLO
import cv2

def main():
    # Updated to use the best weights from our latest training rounds
    model = YOLO("../runs/detect/runs/detect/taco_fold_0/weights/best.pt")
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
