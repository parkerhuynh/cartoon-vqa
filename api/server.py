
from flask import Flask, request, jsonify, make_response
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
import ast

app = Flask(__name__)


def get_img_pth(img_id):
    img_dic = "../images/"
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
        cursor.execute(f"SELECT id, img FROM cartoon WHERE valid = 1 LIMIT 100;")
    results = cursor.fetchall()
    results = [{ "id": result["id"], "img": image_uri(get_img_pth(result["img"]))} for result in results]
    
    return jsonify(results)

@app.route('/harmful_images', methods=['GET', "POST"])
def harmful_images():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT id, img FROM cartoon WHERE valid = 0 limit 40;")
    results = cursor.fetchall()
    results = [{"id": result["id"], "img": image_uri(get_img_pth(result["img"]))} for result in results]
    return jsonify(results)

@app.route('/valid_images', methods=['GET', "POST"])
def valid_images():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT id, img FROM cartoon  WHERE valid = 2 AND duplicate < 99999 ORDER BY RAND() LIMIT 40;")
    results = cursor.fetchall()
    results = [{"id": result["id"], "img": image_uri(get_img_pth(result["img"]))} for result in results]
    
    return jsonify(results)

@app.route('/detele_image/<img_id>', methods=['GET', "POST"])
def detele_image(img_id):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"UPDATE cartoon SET valid = 0 WHERE id = {img_id};")
        connection.commit()
    return "delete image"

@app.route('/restore_image/<img_id>', methods=['GET', "POST"])
def restore_image(img_id):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"UPDATE cartoon SET valid = 2 WHERE id = {img_id};")
        connection.commit()
    return "delete image"




@app.route('/handleSubmit/<img_ids>', methods=['GET', "POST"])
def handleSubmit(img_ids):
    id_list = [int(x) for x in img_ids.split("-")]
    query = "UPDATE cartoon SET valid = 2 WHERE id IN ({})".format(",".join(str(x) for x in id_list))
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(query)
        connection.commit()
    return ""
    
@app.route('/download-data', methods=['GET', "POST"])
def download_data():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM cartoon WHERE valid = 2 AND duplicate < 99999;")
    df = pd.DataFrame(cursor.fetchall())
    csv = df.to_csv(index = False)
    response = make_response(csv)
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=data.csv'
    return response

def convert_text_to_list(text):
    # Remove any surrounding whitespace or quotes from the text
    text = text.strip().strip("'")

    # Use the ast library to safely convert the text into a list of dictionaries
    data = ast.literal_eval(text)

    return data

@app.route('/duplicate_images/<user_id>', methods=['GET', "POST"])
def duplicate_images(user_id):
    user_id = int(user_id)
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT id, img, valid, sub_imgs  FROM cartoon WHERE duplicate = 0 AND valid = 2 AND id > {((user_id-1)*1000)} AND id < {(user_id*1000)} LIMIT 1;")
    results = cursor.fetchall()
    cursor.close()
    if len(results) == 0:
        return "None"
    
    with connection.cursor() as cursor2:
        cursor2.execute(f"SELECT id  FROM cartoon WHERE duplicate > 99999;")
    dup_images = cursor2.fetchall()
    cursor2.close()
    dup_images = [d['id'] for d in dup_images]

    results_1 = {"center_image": {"id": results[0]["id"], "img":  image_uri(get_img_pth(results[0]["img"])), "valid":  results[0]["valid"]}}
    sub_images = convert_text_to_list(results[0]["sub_imgs"])
    sub_images_filter = []
    i = 0
    for sub_image in sub_images:
        if int(sub_image['id']) not in dup_images:
            sub_image["img"] = image_uri(get_img_pth(sub_image["img"]))
            with connection.cursor() as cursor3:
                cursor3.execute(f"SELECT valid FROM cartoon WHERE id = {sub_image['id']}")
            valid_value = cursor3.fetchall()
            cursor3.close()
            sub_image["valid"] = valid_value[0]["valid"]

            if int(sub_image["valid"]) == 2:
                sub_images_filter.append(sub_image)
                i+=1
                    
        if i == 6:
            break
        
    results_1["sub_imgs"] = sub_images_filter
    return jsonify(results_1)

@app.route('/deleteSubDuplicateImages/<img_id>/<sub_id>', methods=['GET', "POST"])
def deleteSubDuplicateImages(img_id, sub_id):
    query = f"UPDATE cartoon SET duplicate = {int(img_id) + 100000} WHERE id = {sub_id};"
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(query)
        connection.commit()
    return ""

@app.route('/doneduplicate/<img_id>', methods=['GET', "POST"])
def doneduplicate(img_id):
    query = f"UPDATE cartoon SET duplicate = {int(img_id)} WHERE id = {img_id};"
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(query)
        connection.commit()
    return ""

@app.route('/status', methods=['GET', "POST"])
def status():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM cartoon;")
    dataset = pd.DataFrame(cursor.fetchall())
    cursor.close()
    invalid_image = len(dataset[dataset["valid"] == 0])
    duplicate = len(dataset[dataset["duplicate"] > 99999])
    rest_image = len(dataset[(dataset["duplicate"] == 0) & (dataset["valid"] == 2)])
    good_images = len(dataset[(dataset["duplicate"] != 0) & (dataset["duplicate"] < 99999)  & (dataset["valid"] == 2)])
    result = {"good":good_images, "Total": len(dataset), "invalid": invalid_image, "valid": len(dataset) - invalid_image, "duplicate": duplicate, "rest": rest_image}
    return jsonify(result)

@app.route('/image_captioning', methods=['GET', "POST"])
def image_captioning():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT id, img, caption_1, caption_2, caption FROM cartoon WHERE valid = 2 AND duplicate < 99999 AND caption is NULL limit 3;")
    results = cursor.fetchall()
    results = [{"id": result["id"], "img": image_uri(get_img_pth(result["img"])), "caption_1": result["caption_1"], "caption_2": result["caption_2"], "caption": result["caption"]} for result in results]
    return jsonify(results)

@app.route('/changeCaption/<img_id>/<newCaption>', methods=["POST"])
def changeCaption(img_id, newCaption):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        if str(newCaption) == "none":
            cursor.execute(f'UPDATE cartoon SET caption = NULL WHERE id = {img_id};')
        else:
            cursor.execute(f'UPDATE cartoon SET caption = "{newCaption}" WHERE id = {img_id};')
        connection.commit()
    return ""

@app.route('/view_caption', methods=['GET', "POST"])
def view_caption():
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT id, img, caption_1, caption_2, caption FROM cartoon WHERE valid = 2 AND duplicate < 99999 AND caption IS NOT NULL ORDER BY RAND() limit 40;")
    results = cursor.fetchall()
    results = [{"id": result["id"], "img": image_uri(get_img_pth(result["img"])), "caption_1": result["caption_1"], "caption_2": result["caption_2"], "caption": result["caption"]} for result in results]
    return jsonify(results)


@app.route('/get_no_images/<route>', methods=['GET', "POST"])
def get_no_images(route):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        if route == "clean_data":
            
            cursor.execute(f"SELECT id FROM clean_data;") 
    results = cursor.fetchall()
    return jsonify(len(results))

@app.route('/get_clean_images/<no_imga_page>/<page_number>', methods=['GET', "POST"])
def get_clean_images(no_imga_page, page_number):
    no_imga_page = int(no_imga_page)
    page_number = int(page_number)
    start_id = (page_number-1)*no_imga_page + 1
    end_ind = page_number*no_imga_page
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT img_id, img, caption_1, caption_2 FROM clean_data WHERE id BETWEEN {start_id} AND {end_ind}")
    results = cursor.fetchall()
    results = [{
        "caption_1": result["caption_1"],
        "caption_2": result["caption_2"],
        "id": result["img_id"],
        "img": image_uri(get_img_pth(result["img"]))} for result in results]
    
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, port=8080)
