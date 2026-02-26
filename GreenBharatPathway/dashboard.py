import streamlit as st
import pandas as pd
import time
import random

st.title("🌿 Green Bharat Live Cleanliness Dashboard")

data = {
    "Street_A": 90,
    "Street_B": 85,
    "Street_C": 95
}

while True:
    for street in data:
        data[street] -= random.randint(0, 2)

    df = pd.DataFrame(list(data.items()), columns=["Street", "Score"])
    st.dataframe(df)
    time.sleep(5)