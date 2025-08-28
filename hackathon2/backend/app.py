from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
import requests
from openai import OpenAI
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


OPENAI_API_KEY = os.getenv("HF_API_TOKEN")
HF_MODEL = "distilbert-base-uncased-distilled-squad"
HF_MODEL_FOR_FLASHCARDS = "google/flan-t5-small"

# ========================
#   DB connection helper
# ========================
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", ""),
        database=os.getenv("MYSQL_DB", "hackathon_db")
    )

# ========================
#      /ask endpoint
# ========================




client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=OPENAI_API_KEY,
)

# -------------------
# DB helper
# -------------------
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", ""),
        database=os.getenv("MYSQL_DB", "hackathon_db")
    )

# -------------------
# /ask endpoint
# -------------------
@app.route("/ask", methods=["POST"])
def ask():
    question = request.form.get("question")
    mood = request.form.get("mood", "neutral")  # default mood

    if not question:
        return jsonify({"answer": "Please provide a question."})

    try:
        # Call Hugging Face chat model
        completion = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3.1:fireworks-ai",
            messages=[{"role": "user", "content": question}],
        )

        answer = completion.choices[0].message.content
        

    except Exception as e:
        print("Error calling HF model:", e)
        answer = "Sorry, I could not generate an answer."

    # Store Q&A + mood in DB
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO questions (question_text, ai_answer, mood) VALUES (%s, %s, %s)",
            (question, answer, mood)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print("DB Error:", e)

    return jsonify({"answer": answer})



# ========================
#    /flashcards endpoint
# ========================

# @app.route("/flashcards", methods=["POST"])
# def flashcards():
#     text = request.form.get("text", "")
#     file = request.files.get("file")

#     if file:
#         content = file.read().decode("utf-8")
#     else:
#         content = text

#     if not content.strip():
#         return jsonify({"error": "No content provided"}), 400

#     try:
#         # Ask the Hugging Face model to create flashcards
#         prompt = f"""
#         Generate 5 concise flashcards from the following text. 
#         Format them as JSON with keys 'question' and 'answer'.

#         Text:
#         {content}
#         """

#         completion = client.chat.completions.create(
    #         model="deepseek-ai/DeepSeek-V3.1:fireworks-ai",
    #         messages=[{"role": "user", "content": prompt}],
    #     )

    #     response_text = completion.choices[0].message.content.strip()

    #     # Try to parse JSON response
    #     import json
    #     try:
    #         cards = json.loads(response_text)
    #     except:
    #         # fallback: naive split if JSON fails
    #         cards = [{"question": f"Q{i+1}", "answer": s.strip()} 
    #                  for i, s in enumerate(content.split(". ")) if s.strip()]

    # except Exception as e:
    #     print("Error generating flashcards:", e)
    #     cards = [{"question": "Error", "answer": "Could not generate flashcards"}]

    # # Save flashcards in DB
    # try:
    #     conn = get_db_connection()
    #     cursor = conn.cursor()
    #     for card in cards:
    #         cursor.execute(
    #             "INSERT INTO flashcards (question, answer) VALUES (%s, %s)",
    #             (card["question"], card["answer"])
    #         )
    #     conn.commit()
    #     cursor.close()
    #     conn.close()
    # except Exception as e:
    #     print("DB Error:", e)

    # return jsonify({"flashcards": cards})

def generate_flashcard(sentence):
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL_FOR_FLASHCARDS}"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {"inputs": f"Create a question and answer from this fact: {sentence}"}

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    output = data[0]["generated_text"] if isinstance(data, list) else str(data)
    return output

@app.route("/flashcards", methods=["POST"])
def flashcards():
    text = request.form.get("text", "")
    file = request.files.get("file")
    if file:
        content = file.read().decode("utf-8")
    else:
        content = text

    sentences = [s.strip() for s in content.split(". ") if s.strip()]
    cards = []

    for s in sentences:
        qa_text = generate_flashcard(s)
        # crude split: assume "Q: ... A: ..." format from HF
        if "A:" in qa_text:
            q, a = qa_text.split("A:", 1)
            question = q.replace("Q:", "").strip()
            answer = a.strip()
        else:
            question, answer = f"What is: {s[:30]}?", s
        cards.append({"question": question, "answer": answer})

    return jsonify({"flashcards": cards})

# ========================
#      /save endpoint
# ========================
@app.route("/save", methods=["POST"])
def save():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()

    if data["type"] == "flashcards":
        for card in data["flashcards"]:
            cursor.execute(
                "INSERT INTO flashcards (question, answer) VALUES (%s, %s)",
                (card["question"], card["answer"])
            )
        conn.commit()
    elif data["type"] == "mood":
        cursor.execute(
            "INSERT INTO moods (student, mood) VALUES (%s, %s)",
            (data.get("student", "Anonymous"), data["mood"])
        )
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"status": "ok"})

# ========================
#     /dashboard endpoint
# ========================
@app.route("/dashboard")
def dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total flashcards
    cursor.execute("SELECT COUNT(*) FROM flashcards")
    total_flashcards = cursor.fetchone()[0]

    # Total questions
    cursor.execute("SELECT COUNT(*) FROM questions")
    total_questions = cursor.fetchone()[0]

    # Recent moods
    cursor.execute("SELECT student, mood FROM moods ORDER BY created_at DESC LIMIT 5")
    moods = [{"student": row[0], "mood": row[1]} for row in cursor.fetchall()]

    # Mood series (counts per mood)
    cursor.execute("SELECT mood, COUNT(*) FROM moods GROUP BY mood")
    mood_series = []
    for row in cursor.fetchall():
        value = {"frustrated": 0, "neutral": 1, "happy": 2}.get(row[0], 1)
        mood_series.append({"label": row[0], "value": value})

    # Dummy top topics
    #top_topics = [{"topic": "Fractions", "count": 8}, {"topic": "Photosynthesis", "count": 5}]
    top_topics = [{"topic": row[0], "count": row[1]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()

    return jsonify({
        "total_questions": total_questions,
        "total_flashcards": total_flashcards,
        "moods": moods,
        "mood_series": mood_series,
        "top_topics": top_topics
    })

if __name__ == "__main__":
    app.run(debug=True)
