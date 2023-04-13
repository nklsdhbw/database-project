from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
import psycopg2
from flask_cors import CORS
app = Flask(__name__)
# CORS(app)  # , origins=["http://localhost:3000/",
# "http://localhost:3000/run-query"])
# db = SQLAlchemy(app)
# ["SQL_ALCHEMY_DATABSE_URI"] = "postgresql://postgres:0609@localhost/postgres"
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/run-query', methods=['POST'])

def run_query():
    # Get the SQL query from the request body
    query = request.json['query']

    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="postgres",
        user="postgres",
        password="0609"
    )

    # Create a cursor object
    cur = conn.cursor()
    cur.execute(query)
    conn.commit()  # commit the transaction
    if query.startswith("SELECT"):
        result = cur.fetchall()
        cur.close()
        conn.close()

        # Return the results as JSON
        return jsonify(result)
    else:
        cur.close()
        conn.close()
        return '', 204


if __name__ == "__main__":
    app.run()
