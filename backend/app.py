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

    conn = psycopg2.connect(
        host="ep-little-rain-759001-pooler.us-east-1.postgres.vercel-storage.com",
        port=5432,
        database="verceldb",
        user="default",
        password="93thMrxkqSjc"
    )

    try:
        cur = conn.cursor()
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
    app.run()
