from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_llm(question, data_summary):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an environmental governance AI assistant."},
            {"role": "user", "content": f"{question}\n\nData:\n{data_summary}"}
        ]
    )
    return response.choices[0].message.content