import pathway as pw
import random
import datetime
import time

class EventSchema(pw.Schema):
    street_id: str
    zone_type: str
    event_type: str
    timestamp: str

class EventGenerator(pw.io.python.ConnectorSubject):

    def run(self):
        streets = ["Street_A", "Street_B", "Street_C"]
        zones = ["Restricted", "Authorized", "Smart_Bin"]
        event_types = ["Illegal", "Legal", "Maintenance"]

        while True:
            self.output(
                {
                    "street_id": random.choice(streets),
                    "zone_type": random.choice(zones),
                    "event_type": random.choice(event_types),
                    "timestamp": datetime.datetime.utcnow().isoformat(),
                }
            )
            time.sleep(2)

events = pw.io.python.read(
    EventGenerator(),
    schema=EventSchema,
)