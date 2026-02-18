# Project NoTrashStreet – Project Plan

> DO NOT LET AI CHANGE MD , CHANGE IT BY HAND SO YOU KNOW WHAT TO DO.

---

# 1. Project Overview

NoTrashStreet is a real-time trash detection and street cleanliness monitoring system.

The system will:

- Detect trash from live camera feeds using a trained YOLO model
- Stream detection events through Kafka
- Process events using Pathway (real-time ETL)
- Store processed data in a database
- Provide a dashboard where humans verify littering events
- Compute and display a cleanliness score per camera

Success Criteria:
- Trash is detected from live camera feed
- Events are streamed into Kafka
- Pathway processes and stores structured data
- Human reviewers can validate events
- Cleanliness score updates dynamically

---

# 2. System Architecture

Camera  
↓  
YOLO Detection Service (GPU Node)  
↓  
Kafka (Confluent Cloud) – Topic: trash-events  
↓  
Pathway ETL Processor  
↓  
Database (PostgreSQL/Supabase for details , Google Cloud For Storage Of Image)  
↓  
FastAPI Backend  
↓  
Frontend Dashboard (Next.js or react.js+express.js on Vercel)

---

# 3. Data Flow

1. Camera captures frame.
2. YOLO model detects trash objects.
3. If detection confidence > threshold:
   - Event is created as JSON.
4. Event is sent to Kafka topic: `trash-events`.
5. Pathway consumes the topic:
   - Deduplicates events
   - Applies time-window logic
   - Computes cleanliness score
   - Stores structured data in database
   - Makes the Camera take a photo if trash exist for a long time
6. Backend API exposes endpoints for frontend.
7. Frontend retrieves:
   - Flagged events
   - Cleanliness scores
   - Review status

---

