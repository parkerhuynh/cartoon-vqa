
from flask import Flask, request, jsonify, make_response, send_file
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
from collections import Counter
import ast
from time import sleep

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_data(result):
    ids = []
    correct = []
    incorrect = []
    partially_correct = []
    ambiguous = []
    partially_incorrect = []

    for item in result:
        for key, value in item.items():
            ids.append(int(key))
            correct.append(int(value['correct']))
            incorrect.append(int(value['incorrect']))
            partially_correct.append(int(value['partially_correct']))
            ambiguous.append(int(value['ambiguous']))
            partially_incorrect.append(int(value['partially_incorrect']))

    return ids, incorrect, partially_incorrect, ambiguous, partially_correct, correct
def convert_string_to_list_of_dicts(json_string):
    try:
        json_list = json.loads(json_string)
        if isinstance(json_list, list):
            return json_list
        else:
            print("The provided JSON string is not a valid JSON array.")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {str(e)}")

def triple_dataset_generation():
    columns = ['HITId', 'HITTypeId', 'Title', 'Description', 'Keywords',  'Reward', 'CreationTime', 'MaxAssignments', 'RequesterAnnotation', 'AssignmentDurationInSeconds', 
           'AutoApprovalDelayInSeconds', 'Expiration', 'NumberOfSimilarHITs', 'LifetimeInSeconds', 'AssignmentId', 'WorkerId', 'AssignmentStatus', 'AcceptTime','SubmitTime',
           'AutoApprovalTime', 'ApprovalTime', 'RejectionTime', 'RequesterFeedback', 'WorkTimeInSeconds', 'LifetimeApprovalRate', 'Last30DaysApprovalRate', 
           'Last7DaysApprovalRate', 'Input.id1', 'Input.id2', 'Input.id3', 'Input.id4', 'Input.id5', 'Input.id6', 'Input.id7', 'Input.id8', 'Input.id9', 'Input.id10', 
           'Input.id11', 'Input.id12', 'Input.img_url1', 'Input.img_url2', 'Input.img_url3', 'Input.img_url4', 'Input.img_url5', 'Input.img_url6', 'Input.img_url7',
           'Input.img_url8', 'Input.img_url9', 'Input.img_url10', 'Input.img_url11', 'Input.img_url12', 'Input.question1', 'Input.question2', 'Input.question3',
           'Input.question4', 'Input.question5', 'Input.question6', 'Input.question7', 'Input.question8', 'Input.question9', 'Input.question10', 'Input.question11',
           'Input.question12', 'Input.answer1', 'Input.answer2', 'Input.answer3', 'Input.answer4', 'Input.answer5', 'Input.answer6', 'Input.answer7', 'Input.answer8',
           'Input.answer9', 'Input.answer10', 'Input.answer11', 'Input.answer12', 'Answer.taskAnswers', 'Approve', 'Reject']
    mturk_data = pd.read_csv("mturk_result.csv")
    mturk_data.columns = columns
    mturk_data["index"]  = mturk_data.index
    mturk_data = mturk_data[["WorkerId", "AssignmentId", "HITId", "Answer.taskAnswers"]]
    result_dic = {
        "worker_id": [],
        "assignment_id": [],
        "hit_id":[],
        "id":[],
        "incorrect":[],
        "partially_incorrect":[],
        "ambiguous":[],
        "partially_correct":[],
        "correct": [],
    }
    for i in range(len(mturk_data)):
        row = mturk_data.iloc[i]
        WorkerId, AssignmentId, HITId, Answer_taskAnswers = row
        results = convert_string_to_list_of_dicts(Answer_taskAnswers)
        ids, incorrect, partially_incorrect, ambiguous, partially_correct, correct = extract_data(results)
        
        result_dic["worker_id"] += [WorkerId]*len(ids)
        result_dic["assignment_id"] += [AssignmentId]*len(ids)
        result_dic["hit_id"] += [HITId]*len(ids)
        result_dic["id"] += ids
        result_dic["incorrect"] += incorrect
        result_dic["partially_incorrect"] += partially_incorrect
        result_dic["ambiguous"] += ambiguous
        result_dic["partially_correct"] += partially_correct
        result_dic["correct"] += correct
    data = pd.DataFrame(result_dic)
    full_base_data = pd.read_csv("data_final.csv")
    full_base_data = full_base_data[["id","Img path", "Question", "Answer"]]
    mturk_data = data.merge(full_base_data, on="id", how="left")
    mturk_data['value'] = mturk_data['incorrect']*0 + mturk_data['partially_incorrect']*1/4 + mturk_data['ambiguous']*2/4 + mturk_data['partially_correct']*3/4 + mturk_data['correct']*4/4
    mturk_data.to_csv("Triples_data.csv", index=False)

def mturk_batch_generation():
    df = pd.read_csv("data_final.csv")
    df["Img path"] = df["Img path"].apply(lambda x: "https://storage.googleapis.com/cartoon_img/" + x)
    division = 12
    sample = (len(df)//division)*division
    df = df[:sample]
    df["id"] =  df.index
    batch_result = pd.read_csv("Triples_data.csv")
    remove_id = set(batch_result["id"])
    df = df[~df["id"].isin(remove_id)]

    index = df["id"].to_list()
    img_path = df["Img path"].to_list()
    question = df["Question"].to_list()
    answer= df["Answer"].to_list()
    A =  {
        "id":index,
        "img_url":img_path,
        "question": question,
        "answer":answer
    }
    sample_per_column = (len(df)//division)
    new_A = {}
    for key, value in A.items():
        for i in range(1, division+1):
            new_key = key + str(i)
            new_value = value[(i - 1) * sample_per_column : i * sample_per_column]
            new_A[new_key] = new_value
    new_A = pd.DataFrame(new_A)
    new_A.to_csv("mturk_batch.csv", index=False)

    
        

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
    
@app.route('/download-data/<dataname>', methods=['GET', "POST"])
def download_data(dataname):
    
    if dataname == "clean_data":
        connection = connect_to_mysql()
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM cartoon WHERE valid = 2 AND duplicate < 99999;")
        df = pd.DataFrame(cursor.fetchall())
        csv = df.to_csv(index = False)
        response = make_response(csv)
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=data.csv'
        return response
    elif dataname == "jn-preprocessing":
        file_path = 'raw_data.csv'
        filename = 'preprocessing.ipynb'
        return send_file(file_path, as_attachment=True)
    
    elif dataname == "raw_data":
        file_path = 'raw_data.csv'
        return send_file(file_path, as_attachment=True)
    
    elif dataname == "mturk_batch":
        mturk_batch_generation()
        file_path = 'mturk_batch.csv'
        return send_file(file_path, as_attachment=True)
    elif dataname == "mturk_decision":
        decision = pd.read_csv("mturk_result.csv")
        message = "It is crucial to emphasize that the data in question concerns children, and any inaccuracies have the potential to affect their cognitive development. Consequently, we have determined that it is necessary to reject all of your submissions."
        decision.loc[decision["AssignmentStatus"] == "Approved", 'Approve'] = "x"
        decision.loc[decision["AssignmentStatus"] == "Rejected", 'Reject'] = message
        decision["AssignmentStatus"] = "Submitted"
        decision.to_csv("decision.csv", index=False)
        sleep(4)
        file_path = 'decision.csv'
        return send_file(file_path, as_attachment=True)
        


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
    query = f"UPDATE cartoon SET duplicate = {int(img_id) + 200000} WHERE id = {sub_id};"
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        cursor.execute(query)
        connection.commit()
    return ""

@app.route('/doneduplicate/<img_id>', methods=['GET', "POST"])
def doneduplicate(img_id):
    query = f"UPDATE cartoon SET duplicate = {int(img_id)+50000} WHERE id = {img_id};"
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

@app.route('/get_no_images/<route>', methods=['GET', "POST"])
def get_no_images(route):
    connection = connect_to_mysql()
    with connection.cursor() as cursor:
        if route == "clean_data":
            
            cursor.execute(f"SELECT id FROM clean_data;") 
    results = cursor.fetchall()
    return jsonify(len(results))
####################################################################################################################################################
@app.route('/upload/<file_name>', methods=['POST'])
def upload_file(file_name):
    uploaded_file = request.files['file']
    # Process the file as needed
    # For example, save it to a specific location
    uploaded_file.save(file_name)
    if file_name == "mturk_result.csv":
        sleep(5)
        triple_dataset_generation()
    return 'File uploaded successfully'

@app.route('/working_time/', methods=['POST','GET'])
def working_time():
    mturk_data = pd.read_csv("mturk_result.csv")
    working_time = mturk_data['WorkTimeInSeconds'].to_list()
    return working_time

@app.route('/worker_working_time/<number_worker>', methods=['POST','GET'])
def worker_working_time(number_worker):
    mturk_data = pd.read_csv("mturk_result.csv")
    working_time = pd.DataFrame(mturk_data.groupby('WorkerId')['WorkTimeInSeconds'].mean())
    working_time = working_time.reset_index()
    working_time = working_time.sort_values("WorkTimeInSeconds")
    working_time.columns = ["Worker Id", "Work Time In Second"]
    working_time = working_time.to_dict(orient='records')
    
    return working_time[:int(number_worker)]

@app.route('/get_worker_profile/<worker_id>', methods=['POST','GET'])
def get_worker_profile(worker_id):
    mturk_data = pd.read_csv("mturk_result.csv")
    worker_profile=mturk_data[mturk_data["WorkerId"]== worker_id][["WorkerId", "SubmitTime","AssignmentStatus","AssignmentId", "WorkTimeInSeconds", "LifetimeApprovalRate", "Last30DaysApprovalRate", "Last7DaysApprovalRate", "Approve", "Reject"]]
    life_approval_complete,  life_approval_all = worker_profile["LifetimeApprovalRate"].iloc[0].split("(")[1].replace(")", "").split("/")
    life_approval_complete,  life_approval_all = int(life_approval_complete),  int(life_approval_all)

    month_approval_complete,  month_approval_all = worker_profile["Last30DaysApprovalRate"].iloc[0].split("(")[1].replace(")", "").split("/")
    month_approval_complete,  month_approval_all = int(month_approval_complete),  int(month_approval_all)

    week_approval_complete,  week_approval_all = worker_profile["Last7DaysApprovalRate"].iloc[0].split("(")[1].replace(")", "").split("/")
    week_approval_complete,  week_approval_all = int(week_approval_complete),  int(week_approval_all)
    worker_profile = worker_profile[["SubmitTime", "WorkTimeInSeconds", "AssignmentId", "AssignmentStatus", "Approve", "Reject"]]
    worker_profile = worker_profile.sort_values("SubmitTime")
    worker_profile = worker_profile.fillna(0)
    worker_profile = worker_profile.reset_index(drop=True)
    worker_profile["id"] = worker_profile.index
    
    summary = [
        {"id":1, "feature": "Avg. Time", "value": int(worker_profile["WorkTimeInSeconds"].mean())},
        {"id":2, "feature": "Num. Assigments", "value": len(worker_profile)}
    ]
    result = {
        "data": worker_profile.to_dict(orient='records'),
        "lifeAproval": [
            {"name": "Approved", "value": life_approval_complete},
            {"name": "reject", "value": life_approval_all - life_approval_complete}
        ],
        "monthAproval": [
            {"name": "Approved", "value": month_approval_complete},
            {"name": "reject", "value": month_approval_all - month_approval_complete}
        ],
        "weekAproval": [
            {"name": "Approved", "value": week_approval_complete},
            {"name": "reject", "value": week_approval_all - week_approval_complete}
        ],
        "summary": summary
    }
    return result

def calculate_rate(approved, rejected):
    if approved + rejected == 0:
        return "Not Review"
    else:
        return (approved / (approved + rejected))*100

@app.route('/get_workers/', methods=['POST','GET'])
def get_workers():
    mturk_data = pd.read_csv("mturk_result.csv")
    mturk_data = mturk_data[["WorkerId", "SubmitTime","AssignmentStatus","AssignmentId", "WorkTimeInSeconds", "LifetimeApprovalRate", "Last30DaysApprovalRate", "Last7DaysApprovalRate", "Approve", "Reject"]]
    counts = mturk_data.groupby(["WorkerId", "AssignmentStatus"]).size().reset_index(name='count')
    pivot_table = counts.pivot(index="WorkerId", columns="AssignmentStatus", values='count').reset_index()
    head_list = ['WorkerId', 'Submitted', 'Rejected', 'Approved']
    for header in head_list:
        if header not in list(pivot_table.columns):
            pivot_table[header] = [0]*len(pivot_table)
    pivot_table = pivot_table.fillna(0)

    worker_counts = mturk_data['WorkerId'].value_counts().reset_index()
    worker_counts.columns = ['WorkerId', 'count']

    average_working_time = mturk_data.groupby('WorkerId')['WorkTimeInSeconds'].mean().reset_index()
    average_working_time['WorkTimeInSeconds'] = average_working_time['WorkTimeInSeconds'].apply(lambda x: int(x))

    workers = pd.merge(worker_counts, average_working_time, on='WorkerId')
    workers = pd.merge(workers, pivot_table,  on='WorkerId')
    workers["id"] = workers.index

    workers_data = workers.sort_values("count",  ascending=False)
    workers_data["Approval Rate"] = workers_data.apply(lambda row: calculate_rate(row['Approved'], row['Rejected']), axis=1)
    numeric_cols = workers_data.select_dtypes(include=['float64', 'int64']).columns
    workers_data[numeric_cols] = workers_data[numeric_cols].astype(int)
    workers_data = workers_data.to_dict(orient='records')

    mturk_data = pd.read_csv("Triples_data.csv")
    mturk_data = mturk_data[["worker_id", "id", "value", "assignment_id"]]

    duplicate_counts = mturk_data.groupby(['worker_id', 'value', 'assignment_id']).size().reset_index(name='count')
    danger_worker = duplicate_counts[duplicate_counts["count"] == 12]["worker_id"]
    danger_worker = danger_worker.value_counts().reset_index()
    danger_worker.columns = ['WorkerId', 'count']
    danger_worker = danger_worker.to_dict(orient='records')

    summary = [
        {"id":1, "name":"Number of Worker", "value":len(workers)},
        {"id":2, "name":"Avg. Asgmts. per Worker", "value":int(workers["count"].mean())},
        {"id":3, "name":"Hardest Worker", "value": worker_counts["WorkerId"].iloc[0]},
        {"id":4, "name":"Num. Asgmts. Hardest Worker", "value": int(worker_counts["count"].iloc[0])}
    ]
    results= {
        "data": workers_data,
        "summary":summary,
        "danger_worker": danger_worker 
    }
    return results

@app.route('/get_assignment/<assignment_id>', methods=['POST','GET'])
def get_assignment(assignment_id):
    columns = ['worker_id', 'assignment_id', 'id', 
    'incorrect', 'partially_incorrect', 'ambiguous', 
    'partially_correct', 'correct', 'Img path', 
    'Question', 'Answer', 'value']
    triple = pd.read_csv("Triples_data.csv")
    triple = triple[triple["assignment_id"] == assignment_id]
    triple = triple[columns]
    results = triple.to_dict(orient='records')
    return results

@app.route('/get_triple/<triple_id>', methods=['POST','GET'])
def get_triple(triple_id):
    try:
        mturk_data = pd.read_csv("data_final.csv")
        mturk_data = mturk_data[mturk_data["id"] == int(triple_id)]
        triple = dict(mturk_data[["Img path", "Question", "Answer", "Topic"]].iloc[0])

        mturk_data = pd.read_csv("Triples_data.csv")
        mask = (mturk_data == int(triple_id)).sum(axis=1) == 1
        assignments = mturk_data[mask]
        assignments = assignments.reset_index()
        assignments["index"] = assignments.index
        assignments = assignments.to_dict(orient='records')
        results = {
            "triple": triple,
            "assignments":assignments
        }
        return results
    except:
        return []

@app.route('/reject_assignment/<assignment_id>', methods=['POST','GET'])
def reject_assignment(assignment_id):
    mturk_data = pd.read_csv("mturk_result.csv")
    mturk_data.loc[mturk_data['AssignmentId'] == assignment_id, 'AssignmentStatus'] = "Rejected"
    mturk_data.to_csv('mturk_result.csv', index=False)
    return []


@app.route('/approve_assignment/<assignment_id>', methods=['POST','GET'])
def approve_assignment(assignment_id):
    mturk_data = pd.read_csv("mturk_result.csv")
    mturk_data.loc[mturk_data['AssignmentId'] == assignment_id, 'AssignmentStatus'] = "Approved"
    mturk_data.to_csv('mturk_result.csv', index=False)
    return []

@app.route('/approve_worker/<worker_id>', methods=['POST','GET'])
def approve_worker(worker_id):
    mturk_data = pd.read_csv("mturk_result.csv")
    mturk_data.loc[mturk_data['WorkerId'] == worker_id, 'AssignmentStatus'] = "Approved"
    mturk_data.to_csv('mturk_result.csv', index=False)
    return []

@app.route('/reject_worker/<worker_id>', methods=['POST','GET'])
def reject_worker(worker_id):
    mturk_data = pd.read_csv("mturk_result.csv")
    mturk_data.loc[mturk_data['WorkerId'] == worker_id, 'AssignmentStatus'] = "Rejected"
    mturk_data.to_csv('mturk_result.csv', index=False)
    return []

@app.route('/get_assignments/', methods=['POST','GET'])
def get_assignments():
    mturk_data = pd.read_csv("mturk_result.csv")
    name_keys = ["Submitted", "Approved", "Rejected"]
    value_status = dict(mturk_data["AssignmentStatus"].value_counts())
    status = {}
    for name_key in name_keys:
        if name_key not in value_status.keys():
            status[name_key] = 0
        else:
            status[name_key] = value_status[name_key]
    status_list = [{"name": key, "value": int(status[key])} for key in status.keys()]

    mturk_data = pd.read_csv("Triples_data.csv")
    mturk_data = mturk_data[["worker_id", "id", "value", "assignment_id"]]
    mapping = {
        1.0: "correct",
        0.75: "partially_correct",
        0.5: "ambiguous",
        0.25: "partially_incorrect",
        0.0: "incorrect"
    }

    mturk_data['value_category'] = mturk_data['value'].replace(mapping)
    category_counting = mturk_data['value_category'].value_counts().reset_index().rename(columns={'index': 'name', 'value': 'count'}).to_dict('records')

    duplicate_counts = mturk_data.groupby(['worker_id', 'value_category', 'assignment_id']).size().reset_index(name='count')
    assignments_1_option = duplicate_counts[duplicate_counts["count"] == 12][['worker_id', 'value_category', 'assignment_id']]
    danger_workers = pd.DataFrame(assignments_1_option["worker_id"].value_counts())
    danger_workers = danger_workers.reset_index()
    danger_workers.rename(columns={'worker_id': 'count', 'index': 'worker_id'}, inplace=True)
    # Counting the number of duplicate rows


    results = {
        "status": status_list,
        "catefory_count": category_counting,
    }
    return results

if __name__ == "__main__":
    app.run(debug=True, port=8080)