import pathway as pw

class EventSchema(pw.Schema):
    street_id: str
    event_type: str

events = pw.debug.table_from_markdown(
    """
    | street_id | event_type
  1 | Street_A  | Illegal
  2 | Street_A  | Illegal
  3 | Street_B  | Illegal
    """
)

illegal_events = events.filter(events.event_type == "Illegal")

# First way
illegal_counts1 = illegal_events.groupby(illegal_events.street_id).reduce(
    illegal_events.street_id,
    count=pw.reducers.count()
)

pw.debug.compute_and_print(illegal_counts1)

# Second way
illegal_counts2 = illegal_events.groupby(illegal_events.street_id).reduce(
    street_id=illegal_events.street_id,
    count=pw.reducers.count()
)
pw.debug.compute_and_print(illegal_counts2)
