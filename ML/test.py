from ultralytics import YOLO
import argparse
import os
from pathlib import Path

def test_model(weights_path, data_yaml, imgsz=640):
    """Run validation on the model and print metrics."""
    print(f"\n--- Evaluating Model: {weights_path} ---")
    model = YOLO(weights_path)
    results = model.val(data=data_yaml, imgsz=imgsz)
    print("Validation Results:")
    print(f"mAP50: {results.results_dict['metrics/mAP50(B)']:.4f}")
    print(f"mAP50-95: {results.results_dict['metrics/mAP50-95(B)']:.4f}")
    return results

def run_inference(weights_path, source, imgsz=640, save=True):
    """Run inference on a single image, directory, or video."""
    print(f"\n--- Running Inference on Source: {source} ---")
    model = YOLO(weights_path)
    results = model.predict(source=source, imgsz=imgsz, save=save)
    
    for i, res in enumerate(results):
        save_path = Path(res.save_dir) / Path(res.path).name
        print(f"Image {i+1} saved to {save_path}")
    return results

def main():
    parser = argparse.ArgumentParser(description="Test and Infere YOLOv8 model")
    parser.add_argument("--fold", type=int, default=0, help="Fold index (0-4) to use for weights")
    parser.add_argument("--mode", type=str, choices=["val", "predict"], default="val", help="Mode: val (validation) or predict (inference)")
    parser.add_argument("--source", type=str, help="Source for inference (image path, folder, or 0 for webcam)")
    parser.add_argument("--imgsz", type=int, default=640, help="Image size")
    
    args = parser.parse_args()
    
    # Path logic
    # The weights are in ../runs/detect/runs/detect/taco_fold_N/weights/best.pt relative to ML dir
    # But since we are likely running FROM ML dir, we should be careful.
    base_runs = Path("../runs/detect/runs/detect")
    weights_path = base_runs / f"taco_fold_{args.fold}" / "weights" / "best.pt"
    data_yaml = Path("TACO/data") / f"data_fold_{args.fold}.yaml"
    
    if not weights_path.exists():
        print(f"Error: Weights not found at {weights_path.absolute()}")
        return

    if args.mode == "val":
        if not data_yaml.exists():
            print(f"Error: YAML not found at {data_yaml}")
            return
        test_model(str(weights_path), str(data_yaml), args.imgsz)
    elif args.mode == "predict":
        if not args.source:
            print("Error: --source is required for predict mode")
            return
        run_inference(str(weights_path), args.source, args.imgsz)

if __name__ == "__main__":
    main()
