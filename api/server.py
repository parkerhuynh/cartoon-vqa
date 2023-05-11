
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
 
app = Flask(__name__)


def get_img_pth(img_id):
    img_dic = "../data/images/"
    ss = img_id[:3]
    image_path = img_dic + ss + "/" + img_id + ".jpg"
    return image_path

def image_uri(filename):
    image_data = open(filename, "rb").read()
    return "data:image/jpg;base64," + base64.b64encode(image_data).decode()

def get_img_pth(img_id):
    img_dic = "/images/"
    ss = img_id[:3]
    image_path = img_dic + ss + "/" + img_id + ".jpg"
    return image_path

def image_uri(filename):
    image_data = open(filename, "rb").read()
    return "data:image/jpg;base64," + base64.b64encode(image_data).decode()

@app.route('/get_images', methods=['GET', "POST"])
def get_images():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT id, img, caption FROM cartoon WHERE valid = 1 LIMIT 100;")
    results = cursor.fetchall()
    results = [{"caption": result["caption"], "id": result["id"], "img": get_img_pth(result["img"])} for result in results]
    return jsonify(results)

@app.route('/detele_image/<img_id>', methods=['GET', "POST"])
def detele_image(img_id):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"UPDATE cartoon SET valid = 0 WHERE id = {img_id};")
        connection.commit()
    return "delete image"

@app.route('/changeCaption/<img_id>/<newCaption>', methods=["POST"])
def changeCaption(img_id, newCaption):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f'UPDATE cartoon SET caption = "{newCaption}" WHERE id = {img_id};')
        connection.commit()
    return ""

@app.route('/imageDone/<img_id>', methods=['GET', "POST"])
def imageDone(img_id):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"UPDATE cartoon SET valid = 2 WHERE id = {img_id};")
        connection.commit()
    return ""

@app.route('/handleSubmit/<img_ids>', methods=['GET', "POST"])
def handleSubmit(img_ids):
    id_list = [int(x) for x in img_ids.split("-")]
    query = "UPDATE cartoon SET valid = 2 WHERE id IN ({})".format(",".join(str(x) for x in id_list))
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(query)
        connection.commit()
    return ""



if __name__ == "__main__":
    app.run(debug=True, port=8080)
