# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://math.riskspace.net", "http://localhost:3000", "http://localhost:3001"]}})

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Construct database URI from environment variables
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME')}"

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Session(db.Model):
    logging.debug("Session model started")
    __tablename__ = 'sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False, default='active')
    entry_path = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    sources = db.relationship('Source', backref='session', lazy=True)
    transcript = db.relationship('Transcript', backref='session', lazy=True)
    media = db.relationship('Media', backref='session', lazy=True)

class Source(db.Model):
    logging.debug("Source model started")
    __tablename__ = 'sources'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Transcript(db.Model):
    logging.debug("Transcript model started")
    __tablename__ = 'transcripts'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    host_count = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    style = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Media(db.Model):
    logging.debug("media model started")
    __tablename__ = 'media'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    url = db.Column(db.Text)
    media_metadata = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/api/sessions', methods=['POST'])
def create_session():
    data = request.json
    email = data.get('email')
    entry_path = data.get('entryPath')
    
    if not entry_path:
        return jsonify({'error': 'Entry path is required'}), 400
        
    session = Session(
        email=email,
        entry_path=entry_path
    )
    
    db.session.add(session)
    db.session.commit()
    
    return jsonify({
        'id': session.id,
        'email': session.email,
        'status': session.status,
        'entry_path': session.entry_path
    }), 201

@app.route('/api/sessions/<int:session_id>', methods=['GET'])
def get_session(session_id):
    session = Session.query.get_or_404(session_id)
    return jsonify({
        'id': session.id,
        'email': session.email,
        'status': session.status,
        'entry_path': session.entry_path,
        'created_at': session.created_at.isoformat()
    })

@app.route('/api/sessions/<int:session_id>/sources', methods=['POST'])
def add_source(session_id):
    session = Session.query.get_or_404(session_id)
    data = request.json
    
    source = Source(
        session_id=session_id,
        content=data['content'],
        type=data['type']
    )
    
    db.session.add(source)
    db.session.commit()
    
    return jsonify({
        'id': source.id,
        'status': source.status
    }), 201

@app.route('/api/sessions/<int:session_id>/status', methods=['PUT'])
def update_session_status(session_id):
    session = Session.query.get_or_404(session_id)
    data = request.json
    
    session.status = data['status']
    db.session.commit()
    
    return jsonify({
        'id': session.id,
        'status': session.status
    })

if __name__ == '__main__':
    app.run(debug=True)