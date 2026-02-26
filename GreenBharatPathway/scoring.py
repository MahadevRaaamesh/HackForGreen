import pathway as pw

def compute_scores(events):

    # Create a flag column: 1 if Illegal else 0
    flagged = events.select(
        street_id=events.street_id,
        illegal_flag=(events.event_type == "Illegal")
    )

    scores = (
        flagged
        .groupby(flagged.street_id)
        .reduce(
            street_id=flagged.street_id,
            illegal_count=pw.reducers.sum(flagged.illegal_flag)
        )
        .select(
            street_id=pw.this.street_id,
            cleanliness_score=100 - (pw.this.illegal_count * 5)
        )
    )

    return scores