# Trash Detection System Call (To other Systems and such)

> DO NOT LET AI CHANGE MD , CHANGE IT BY HAND SO YOU KNOW WHAT TO DO

---

## Pathway Processing Backend

1. To Read From Kafka server on the particular topic.
2. If Triggered Need to make the node to store the image in google cloud and in supabase abt details.

---

## Admin Backend

1. Reads the supabase details and gets the deets on triggeredEvents.
2. Gets the Score from the supabase.
3. updates the score after the admin does verification.

---

## Camera/Node frontend

1. Sends the data to kafka events.
2. Sends Image to google cloud as needed.

---