import pymysql.cursors

def connect_to_mysql():
    return pymysql.connect(host='localhost',
                           user='root',
                           password='Ngocdung242!',
                           db='cartoon',
                           charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)
