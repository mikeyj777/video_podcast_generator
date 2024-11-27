# server/endpoints/claude_messages.py
from flask import jsonify
from anthropic import Anthropic
from db.models import db, Session, Source, Transcript
import os
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def claude_message(request, session_id):
    try:
        data = request.json
        settings = data.get('settings', {})
        
        # Verify session exists
        session = Session.query.get(session_id)
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        logging.info(f"Session ID: {session_id}")
        # Get sources for this session
        sources = Source.query.filter_by(session_id=session_id).all()
        if not sources:
            return jsonify({'error': 'No sources found for this session'}), 400
        logging.info(f"Sources: {sources}")
            
        source_contents = [source.content for source in sources]
        logging.info(f"Source contents: {source_contents}")
        
        # Initialize Anthropic client
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            logging.error("ANTHROPIC_API_KEY not found in environment variables")
            return jsonify({'error': 'API configuration error'}), 500
            
        client = Anthropic(api_key=api_key)
        
        # Construct the prompt
        prompt = construct_transcript_prompt(source_contents, settings)
        
        # Make the API call to Claude
        try:
            message = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=calculate_max_tokens(settings.get('duration', 15)),
                temperature=0.7,
                system="You are an expert at creating engaging podcast transcripts.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
        except Exception as e:
            logging.error(f"Claude API error: {str(e)}")
            return jsonify({'error': 'Failed to generate transcript'}), 500
        
        logging.info(f"Transcript: {message.content[0].text}")

        # Store the transcript
        try:
            transcript = Transcript(
                session_id=session_id,
                content=message.content[0].text,
                host_count=settings.get('host_count'),
                duration=settings.get('duration'),
                style=settings.get('style')
            )
            db.session.add(transcript)
            db.session.commit()
        except Exception as e:
            logging.error(f"Database error: {str(e)}")
            return jsonify({'error': 'Failed to save transcript'}), 500
        
        return jsonify({
            'content': message.content[0].text,
            'transcript_id': transcript.id
        }), 200
        
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def construct_transcript_prompt(sources, settings):
    source_text = "\n\n".join(sources)
    prompt_text = f"""
        Generate a {settings.get('style', 'casual')} conversation between {settings.get('host_count', 2)} hosts discussing the following sources:

        {source_text}

        Additional parameters:
        - Target length: {settings.get('duration', 15)} minutes
        - Technical level: {settings.get('technical_level', 3)}
        - Use analogies: {settings.get('use_analogies', True)}
        - Focus areas: {', '.join(settings.get('focus_areas', ['findings']))}
        - Conversation dynamics: {settings.get('dynamics', 'collaborative')}
        - Use citations: {settings.get('use_citations', False)}

        Please generate a natural-sounding conversation that covers the key points while maintaining the specified style and parameters.

        Do not include any explanatory text. Only provide the transcript. 
        
        This is to be used as a podcast.
        """
    logging.info(f"Prompt: {prompt_text}")
    return prompt_text

def calculate_max_tokens(minutes):
    # Rough estimation: average speaking rate * minutes * token/word ratio
    words_per_minute = 150
    token_to_word_ratio = 1.3
    return int(minutes * words_per_minute * token_to_word_ratio)