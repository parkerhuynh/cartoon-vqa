
from flask import Flask, request, jsonify
import json
import pandas as pd
import pymysql.cursors
from utils import connect_to_mysql
import numpy as np
import base64
import json
import os
import openai
import re

openai.organization = "org-kt8nvYqdeK23sZZsbSSjU5b3"
openai.api_key = "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"

def split_questions_answers(questions_answers):
    questions_answers = questions_answers.split("\n")
    questions = []
    answers = []
    for question_answer in questions_answers:
        question, answer = question_answer.split("?")
        questions.append(question)
        answers.append(answer)
    return questions, answers

def get_questions_anwers(caption):
    promt = "you are required to ask exactly 10 questions about a given context. " + \
    "The question topics are: yes/no, counting, object, activity, " + \
    "color, posistion. Answer within 3 words.\n" + \
    "context: a man is jumping to catch a ball.\n" + \
    "output:1. What is he doing?\nJumping.\n2. What sport is he playing?\nFootball.\n3. What color is the ball?\nUnknown."
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user",
         "content": f"{promt}:\ncontext: {caption}\noutput:"}
    ])
    questions_answers = completion.choices[0].message.content
    return questions_answers
app = Flask(__name__)


def get_img_pth(img_id):
    img_dic = "../data/images/"
    ss = img_id[:3]
    image_path = img_dic + ss + "/" + img_id + ".jpg"
    return image_path

def image_uri(filename):
    image_data = open(filename, "rb").read()
    return "data:image/jpg;base64," + base64.b64encode(image_data).decode()

@app.route('/problems/', methods=['GET', "POST"])
def get_problems():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM cartoon WHERE valid <> 0 LIMIT 30;")
    problems = pd.DataFrame(cursor.fetchall())
    if len(problems) == 0:
            return json.dumps([])
    results = []
    if len(problems) > 0:
        for i in range(len(problems)):
            image_path = get_img_pth(problems["img"][i])
            image_data = image_uri(image_path)  
            result = {
                "img": image_data,
                "caption": problems["caption"][i],
                "id": str(problems["id"][i]),
                "qa": str(problems["qa"][i]),
            }
            results.append(result)

    num_row = len(results)//2
    rows = []
    for i in range(0, num_row*2, 2):
        row = {"left": results[i], "right": results[i+1] if i+1 < len(results) else None}
        rows.append(row)
    return jsonify(rows)

@app.route('/deleteImage/<img_id>', methods=["POST"])
def deleteImage(img_id):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"UPDATE cartoon SET valid = 0 WHERE id = {img_id};")
        connection.commit()
    return ""

@app.route('/QAGenerator/<img_id>/<caption>', methods=['GET', "POST"])
def QAGenerato(img_id, caption):
    qa = get_questions_anwers(caption)
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f'UPDATE cartoon SET qa = "{qa}" WHERE id = {img_id};')
        connection.commit()
    print("Done!")
    return ""
if __name__ == "__main__":
    app.run(debug=True, port=8080)
