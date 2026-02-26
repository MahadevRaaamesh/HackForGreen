from ultralytics import YOLO
import os

def main():
    k = 5
    base_dir = "TACO/data"
    
    for fold in range(k):
        yaml_path = f"{base_dir}/data_fold_{fold}.yaml"
        if not os.path.exists(yaml_path):
            print(f"Skipping fold {fold}, no configuration found at {yaml_path}.")
            continue
            
        print(f"--- Training Fold {fold} ---")
        model = YOLO("yolov8s.pt") # Load fresh pre-trained weights for each fold
        
        # Train
        results = model.train(
            data=yaml_path,
            epochs=50,
            imgsz=640,
            device=0, # Use GPU if available
            project="runs/detect",
            name=f"taco_fold_{fold}",
            exist_ok=True
        )
        print(f"Fold {fold} training completed.")

if __name__ == "__main__":
    main()