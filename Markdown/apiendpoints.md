# Trash Detection System API Specification

> DO NOT LET AI CHANGE MD , CHANGE IT BY HAND SO YOU KNOW WHAT TO DO

---

## Admin Backend API

1.GET /TriggeredCameras

Gets the cameras that are triggered and their details (time,camera), the Image where trash was detected .

2.GET /StreetCleanlinessScore

Gets the Street CleanlinessScore for all streets present.

---

## Node Frontend

1. GET /Image 

Sent by Pathway Processing backend to store image from node/camera in google cloud.

---
