import os
import random
from pathlib import Path
from sklearn.model_selection import KFold
import yaml

def create_kfold_split():
    # Configuration
    dataset_root = Path("TACO/data")
    images_dir = dataset_root / "images"
    labels_dir = dataset_root / "labels"
    num_folds = 5
    seed = 42

    # Get all image files
    image_extensions = ('.jpg', '.jpeg', '.png', '.JPG', '.PNG')
    all_images = []
    
    # We walk through all batches
    for batch_dir in images_dir.iterdir():
        if batch_dir.is_dir():
            for img_path in batch_dir.iterdir():
                if img_path.suffix in image_extensions:
                    all_images.append(img_path)

    print(f"Found {len(all_images)} images.")

    # Pair with labels
    paired_data = []
    for img_path in all_images:
        # Corresponding label path
        # image is TACO/data/images/batch_N/filename.ext
        # label should be TACO/data/labels/batch_N/filename.txt (or .JPG/.jpg)
        batch_name = img_path.parent.name
        label_batch_dir = labels_dir / batch_name
        
        # Look for label file with same stem
        label_found = False
        if label_batch_dir.exists():
            for label_ext in ('.txt', '.jpg', '.JPG', '.txt'): # Some labels might have .JPG extension as seen earlier
                label_path = label_batch_dir / f"{img_path.stem}{label_ext}"
                if label_path.exists():
                    paired_data.append(img_path)
                    label_found = True
                    break
        
        if not label_found:
            print(f"Warning: No label found for {img_path}")

    print(f"Paired {len(paired_data)} images with labels.")

    # Convert to absolute paths for the txt files
    paired_data = [str(p.absolute()).replace("\\", "/") for p in paired_data]
    random.seed(seed)
    random.shuffle(paired_data)

    # Perform K-Fold split
    kf = KFold(n_splits=num_folds, shuffle=True, random_state=seed)
    
    # Load original class names from data.yaml
    with open("TACO/data.yaml", 'r') as f:
        original_data = yaml.safe_load(f)
    
    class_names = original_data.get('names', {})
    nc = original_data.get('nc', 60)

    for fold, (train_idx, val_idx) in enumerate(kf.split(paired_data)):
        train_files = [paired_data[i] for i in train_idx]
        val_files = [paired_data[i] for i in val_idx]

        # Write txt files
        train_txt = dataset_root / f"train_fold_{fold}.txt"
        val_txt = dataset_root / f"val_fold_{fold}.txt"

        with open(train_txt, 'w') as f:
            f.write("\n".join(train_files))
        
        with open(val_txt, 'w') as f:
            f.write("\n".join(val_files))

        # Create fold-specific yaml
        # IMPORTANT: The paths in the yaml should be relative to the 'path' field or absolute
        fold_yaml = {
            'path': str(dataset_root.absolute()).replace("\\", "/"),
            'train': f"train_fold_{fold}.txt",
            'val': f"val_fold_{fold}.txt",
            'nc': nc,
            'names': class_names
        }

        with open(dataset_root / f"data_fold_{fold}.yaml", 'w') as f:
            yaml.dump(fold_yaml, f, default_flow_style=False)
        
        print(f"Fold {fold}: Train={len(train_files)}, Val={len(val_files)}")

if __name__ == "__main__":
    create_kfold_split()
