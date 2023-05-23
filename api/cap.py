import tiktoken
import pandas as pd
import matplotlib.pyplot as plt
import openai
import os
from time import sleep

cap = pd.read_csv("cap.csv")

file_path = "/home/ngoc/githubs/openai_key.txt"

with open(file_path, "r") as file:
    key = file.read()


openai.api_key = key

def get_questions_anwers(promt):
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user",
         "content": promt}
    ])
    questions_answers = completion.choices[0].message.content
    return questions_answers

QAs_1 = []

for i in range(5):
    row = cap.iloc[i]
    promt_1, promt_2, promt_3 = row["promt_1"], row["promt_2"], row["promt_3"]
    result_1 = get_questions_anwers(promt_1)
    print(result_1)
    QAs_1.append(result_1)
    