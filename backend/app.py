import os
import pandas as pd
from io import BytesIO
from flask import Flask, jsonify, request, redirect, url_for, session, send_file
from flask_cors import CORS
from models import db, User, Task, Habit, HabitLog
from auth import setup_oauth
from datetime import datetime, date
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key-for-dev")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Setup CORS to allow React frontend to communicate with Flask
CORS(app, supports_credentials=True)

# Initialize Database and OAuth
db.init_app(app)
oauth = setup_oauth(app)

with app.app_context():
    db.create_all()

# --- OAuth Routes ---

@app.route('/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.parse_id_token(token, nonce=None)
    
    # Save or update user in database
    user = User.query.filter_by(email=user_info['email']).first()
    if not user:
        user = User(
            email=user_info['email'],
            name=user_info.get('name'),
            picture=user_info.get('picture')
        )
        db.session.add(user)
        db.session.commit()
    
    session['user_id'] = user.id
    return redirect("http://localhost:5173") # Redirect to React Frontend (Vite default port)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"})

# --- API Routes ---

@app.route('/api/user', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    user = User.query.get(user_id)
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "picture": user.picture
    })

# Tasks CRUD
@app.route('/api/tasks', methods=['GET', 'POST'])
def manage_tasks():
    user_id = session.get('user_id')
    if not user_id: return jsonify({"error": "Unauthorized"}), 401
    
    if request.method == 'GET':
        freq = request.args.get('frequency')
        query = Task.query.filter_by(user_id=user_id)
        if freq:
            query = query.filter_by(frequency=freq)
        tasks = query.all()
        return jsonify([t.to_dict() for t in tasks])
    
    if request.method == 'POST':
        data = request.json
        new_task = Task(
            user_id=user_id,
            title=data['title'],
            description=data.get('description', ''),
            frequency=data.get('frequency', 'Daily'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else datetime.utcnow()
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def task_detail(task_id):
    user_id = session.get('user_id')
    if not user_id: return jsonify({"error": "Unauthorized"}), 401
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    
    if request.method == 'PUT':
        data = request.json
        task.is_completed = data.get('is_completed', task.is_completed)
        db.session.commit()
        return jsonify(task.to_dict())
    
    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return '', 204

# Habits CRUD
@app.route('/api/habits', methods=['GET', 'POST'])
def manage_habits():
    user_id = session.get('user_id')
    if not user_id: return jsonify({"error": "Unauthorized"}), 401
    
    if request.method == 'GET':
        habits = Habit.query.filter_by(user_id=user_id).all()
        return jsonify([h.to_dict() for h in habits])
    
    if request.method == 'POST':
        data = request.json
        new_habit = Habit(user_id=user_id, name=data['name'])
        db.session.add(new_habit)
        db.session.commit()
        return jsonify(new_habit.to_dict()), 201

# --- Export Routes ---

@app.route('/api/export/csv')
def export_csv():
    user_id = session.get('user_id')
    if not user_id: return "Unauthorized", 401
    
    tasks = Task.query.filter_by(user_id=user_id).all()
    df = pd.DataFrame([{
        'Title': t.title,
        'Frequency': t.frequency,
        'Completed': t.is_completed,
        'Due Date': t.due_date
    } for t in tasks])
    
    output = BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    return send_file(output, mimetype='text/csv', as_attachment=True, download_name='progress_report.csv')

@app.route('/api/export/pdf')
def export_pdf():
    user_id = session.get('user_id')
    if not user_id: return "Unauthorized", 401
    
    tasks = Task.query.filter_by(user_id=user_id).all()
    
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 750, "Task & Habit Tracker Report")
    
    p.setFont("Helvetica", 12)
    y = 700
    for task in tasks:
        status = "[X]" if task.is_completed else "[ ]"
        p.drawString(100, y, f"{status} {task.title} ({task.frequency})")
        y -= 20
        if y < 50:
            p.showPage()
            y = 750
            
    p.save()
    buffer.seek(0)
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name='report.pdf')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
