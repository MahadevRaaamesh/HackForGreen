import pathway as pw
from event_stream import events
from scoring import compute_scores

scores = compute_scores(events)

pw.io.print(scores)

pw.run()