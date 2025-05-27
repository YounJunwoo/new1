from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for, flash, session
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import paho.mqtt.client as mqtt
import json
import os
from src.chatbot import chat  # 수정된 chatbot.py 내 chat 함수

load_dotenv()

app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/static"
)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://15.164.226.12:5000"}})
app.secret_key = os.getenv("SECRET_KEY", "dev")

# ----------------------- DB 설정 -----------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    nickname = db.Column(db.String(80), unique=True) 
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20))

with app.app_context():
    db.create_all()

# ----------------------- MQTT 설정 -----------------------
MQTT_BROKER = "15.164.226.12"
MQTT_PORT = 1883
MQTT_TOPIC = "smartfarm/data"
MQTT_SYNC_RESPONSE_TOPIC = "server/sync_response"

mqtt_client = mqtt.Client()

def on_message(client, userdata, message):
    payload = message.payload.decode("utf-8")
    topic = message.topic
    try:
        if topic == MQTT_TOPIC:
            data = json.loads(payload)
            required_keys = ["temperature", "humidity", "timestamp", "soildry", "waterlow", "pumpactive", "lightvalue"]
            if all(key in data for key in required_keys):
                print("수신된 데이터:", data)
                socketio.emit('update_data', data)
            else:
                print("누락된 필드 있음:", data)
        elif topic == MQTT_SYNC_RESPONSE_TOPIC:
            print("📡 동기화 응답 수신:", payload)
            socketio.emit("sync_response", {"status": payload})
    except json.JSONDecodeError as e:
        print("JSON 디코딩 오류:", e)

mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.subscribe(MQTT_TOPIC)
mqtt_client.subscribe(MQTT_SYNC_RESPONSE_TOPIC)

def mqtt_loop():
    mqtt_client.loop_start()

# ----------------------- REST API -----------------------

@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json()
    username = data.get("username")
    nickname = data.get("nickname")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "이미 존재하는 사용자입니다."}), 400
    if User.query.filter_by(nickname=nickname).first():
        return jsonify({"success": False, "message": "중복된 닉네임입니다."}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, nickname=nickname, email=email, password=hashed_pw, phone=phone)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "message": "회원가입 성공"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({"success": False, "message": "아이디를 확인하세요."}), 400

    if not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"success": False, "message": "비밀번호가 틀렸습니다."}), 400

    session["user_id"] = user.id
    return jsonify({"success": True, "message": "로그인 성공"})

@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"success": True, "message": "로그아웃 완료"})

@app.route("/api/check", methods=["GET"])
def api_check():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({"loggedIn": True, "username": user.username})
    else:
        return jsonify({"loggedIn": False})

@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    phone = data.get("phone")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "등록되지 않은 이메일입니다."}), 404

    temp_pw = "Temp1234!"
    hashed_pw = bcrypt.generate_password_hash(temp_pw).decode("utf-8")
    user.password = hashed_pw
    db.session.commit()

    print(f"[비밀번호 찾기] {email} → 임시 비밀번호: {temp_pw}")
    return jsonify({"success": True, "message": "임시 비밀번호가 발급되었습니다."})

@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_list = [{
        "email": u.email,
        "date": "",
        "role": "관리자",
        "id": u.id,
        "active": True
    } for u in users]

    return jsonify({"success": True, "users": user_list})

@app.route("/api/user-info", methods=["GET"])
def user_info():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "로그인이 필요합니다."}), 401

    user = User.query.get(session["user_id"])
    if not user:
        return jsonify({"success": False, "message": "사용자 정보 없음"}), 404

    return jsonify({
        "success": True,
        "user": {
            "email": user.email,
            "password": "********",
            "phone": user.phone or ""
        }
    })

@app.route("/api/delete-user", methods=["POST"])
def delete_user():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "로그인이 필요합니다."}), 401

    user = User.query.get(session["user_id"])
    if user:
        db.session.delete(user)
        db.session.commit()
        session.clear()
        return jsonify({"success": True, "message": "회원 탈퇴 완료"})
    else:
        return jsonify({"success": False, "message": "사용자를 찾을 수 없습니다."}), 404

@app.route("/api/sync", methods=["POST"])
def sync_to_raspberry():
    print("✅ 동기화 요청 수신 → 라즈베리로 MQTT 전송")
    try:
        mqtt_client.publish("raspberry/sync", "sync_now")
        return jsonify({"success": True, "message": "동기화 요청 전송됨"})
    except Exception as e:
        print("🚨 동기화 요청 실패:", e)
        return jsonify({"success": False, "message": "전송 실패"}), 500

# ----------------------- 챗봇 API -----------------------

@app.route("/chat", methods=["POST"])
def chat_api():
    data = request.get_json(force=True)
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        answer = chat(question)
        return jsonify({"answer": answer})
    except Exception as e:
        print("🚨 처리 중 예외:", e)
        return jsonify({"error": "Internal server error"}), 500

# ----------------------- React 정적 파일 라우팅 -----------------------

@app.route("/")
def serve_react():
    return render_template("index.html")

@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template("index.html")

# ----------------------- 실행 -----------------------

socketio = SocketIO(app)

if __name__ == '__main__':
    mqtt_loop()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
