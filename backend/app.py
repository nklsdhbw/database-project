from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
import psycopg2
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/run-query', methods=['POST'])
def run_query():
    # Get the SQL query from the request body
    query = request.json['query']
    parameters = None
    try:
        parameters = request.json['parameters']
        parameters = tuple(parameters)
    except:
        pass


    conn = psycopg2.connect(
        host="postgres",
        port=5432,
        database="postgres",
        user="postgres",
        password="0609"
    )

    try:
        cur = conn.cursor()
        if parameters != None:
            cur.execute(query, parameters)
        else:
            cur.execute(query)
        conn.commit()
        if query.startswith("SELECT"):
            result = cur.fetchall()
            print("test")
            print(result)
            
            # Return the results as JSON
            columnNames = [desc[0] for desc in cur.description]
            print(jsonify(result))
            returnValue = [columnNames, result]
            return jsonify(returnValue)
        else:
            return '', 204
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
