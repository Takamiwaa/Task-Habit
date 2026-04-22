from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    picture = db.Column(db.String(255))
    tasks = db.relationship('Task', backref='owner', lazy=True)
    habits = db.relationship('Habit', backref='owner', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_completed = db.Column(db.Boolean, default=False)
    # Frequency: Daily, Weekly, Monthly
    frequency = db.Column(db.String(20), default='Daily')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat(),
            'is_completed': self.is_completed,
            'frequency': self.frequency
        }

class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    logs = db.relationship('HabitLog', backref='habit', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'current_streak': self.get_current_streak()
        }

    def get_current_streak(self):
        # Implementation for calculating streak based on HabitLog
        # Simplified: Count consecutive days from today backwards
        streak = 0
        sorted_logs = sorted(self.logs, key=lambda x: x.date, reverse=True)
        # Logic to check consecutive dates...
        # For now return a mock or simplified count
        return len([l for l in self.logs if l.is_completed])

class HabitLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
