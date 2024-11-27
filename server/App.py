from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from db.models import db, Session, Source, Transcript, Media
from endpoints.claude_messages import claude_message

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://math.riskspace.net", "http://localhost:3000", "http://localhost:3001"]}})

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Database configuration
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db with app
db.init_app(app)

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

@app.route('/api/sessions/<int:session_id>/chat', methods=['POST'])
def chat(session_id):
    # Verify session exists
    session = Session.query.get_or_404(session_id)
    return claude_message(request, session_id)

if __name__ == '__main__':
    app.run(debug=True)