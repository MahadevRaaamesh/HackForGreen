# Database

> DO NOT LET AI CHANGE MD , CHANGE IT BY HAND SO YOU KNOW WHAT TO DO

---
# Database & Storage Specification (db.md)

> DO NOT LET AI CHANGE MD , CHANGE IT BY HAND SO YOU KNOW WHAT TO DO

---

# 1. Supabase (PostgreSQL) Schema

This section defines the tables required to store camera metadata, detection events, and cleanliness scores.

## 1.1 Tables

### **1. `cameras`**
Stores registration details for each physical camera unit/node.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | **PRIMARY KEY** | Unique Camera ID (e.g., `cam_01`). |
| `location_name` | `TEXT` | NOT NULL | Human-readable location (e.g., "Main St"). |
| `latitude` | `FLOAT` | NULL | GPS Latitude (optional). |
| `longitude` | `FLOAT` | NULL | GPS Longitude (optional). |
| `status` | `VARCHAR(20)` | DEFAULT `'active'` | `active`, `inactive`, `maintenance`. |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Registration time. |

---

### **2. `detection_events`**
Stores trash detection events processed by Pathway and ingested from Kafka.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PRIMARY KEY**, DEFAULT `gen_random_uuid()` | Unique Event ID. |
| `camera_id` | `VARCHAR(50)` | **FOREIGN KEY** -> `cameras.id` | The camera that detected the trash. |
| `confidence` | `FLOAT` | NOT NULL | YOLO model confidence score (0.0 - 1.0). |
| `detected_at` | `TIMESTAMPTZ` | NOT NULL | Timestamp when the frame was captured. |
| `gcs_image_url` | `TEXT` | NOT NULL | Public/Signed URL to the image in Google Cloud. |
| `verification_status` | `VARCHAR(20)` | DEFAULT `'pending'` | `pending`, `verified_trash`, `false_positive`. |
| `reviewed_by` | `UUID` | NULL | ID of the admin who reviewed it (if applicable). |
| `reviewed_at` | `TIMESTAMPTZ` | NULL | Time of review. |

---

### **3. `cleanliness_scores`**
Stores the calculated cleanliness score for a location over time. Used for the dashboard graph and current status.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | **PRIMARY KEY**, GENERATED ALWAYS AS IDENTITY | Log ID. |
| `camera_id` | `VARCHAR(50)` | **FOREIGN KEY** -> `cameras.id` | The location being scored. |
| `score` | `INT` | CHECK (score BETWEEN 0 AND 100) | 0 (Dirty) to 100 (Clean). |
| `calculated_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | When this score was computed. |

---

## 1.2 SQL Initialization Script

```sql
-- Create Cameras Table
CREATE TABLE cameras (
    id VARCHAR(50) PRIMARY KEY,
    location_name TEXT NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Detection Events Table
CREATE TABLE detection_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camera_id VARCHAR(50) REFERENCES cameras(id),
    confidence FLOAT NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL,
    gcs_image_url TEXT NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified_trash, false_positive
    reviewed_by UUID, -- Link to auth.users if using Supabase Auth
    reviewed_at TIMESTAMPTZ
);

-- Create Cleanliness Scores Table
CREATE TABLE cleanliness_scores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    camera_id VARCHAR(50) REFERENCES cameras(id),
    score INT CHECK (score >= 0 AND score <= 100),
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX idx_events_camera_time ON detection_events(camera_id, detected_at);
CREATE INDEX idx_scores_camera_time ON cleanliness_scores(camera_id, calculated_at);