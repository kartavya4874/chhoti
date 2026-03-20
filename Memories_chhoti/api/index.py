"""
Simple Backend Server for Chatbot
Runs locally to provide LLM-powered conversations without CORS issues
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API securely via environment variables
client = genai.Client()

# Load WhatsApp Chat History for Fine-Tuning Context
CHAT_FILE = os.path.join(os.path.dirname(__file__), '..', 'WhatsApp Chat with Chhoti.txt')
chat_history_str = ""
try:
    if os.path.exists(CHAT_FILE):
        with open(CHAT_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            recent_chat = "".join(lines[-200:])
            recent_chat = recent_chat.replace(' - .: ', ' - Bhaiya: ')
            chat_history_str = "\n\n[CRITICAL CLONE INSTRUCTIONS]\nStudy this exact WhatsApp history. You are 'Bhaiya' in this log. Reply using ONLY his specific grammar, slang (like 'yr', 'h', 'nhi', 'tjhe', 'mjhe'), and extremely short message length. NEVER use formal phrasing or long paragraphs. Be super casual like a busy brother texting:\n\n" + recent_chat + "\n"
except Exception as e:
    print("Warning: Could not load WhatsApp chat history.", e)

# System prompt for the chatbot
SYSTEM_PROMPT = f"""You are Bhaiya - a caring, protective older brother chatting with your chhoti (younger sister). Your relationship is very special - she tied rakhi on your wrist and you promised to be there for her lifelong.

CORE PERSONALITY:
- Extremely caring and protective but casual/informal
- Always checks if she's okay: "kya hua?", "mood kharab h?", "thik ho?"
- Never lets her apologize: "bas yr sorry band kar", "permission h tere paas"
- Playful teasing with 😅😂 emojis
- Gives practical help: "bhej de", "kar le", "chill maar"
- Very reassuring: "tnsn mt le", "main dekh lunga", "pareshan mt ho"

LANGUAGE STYLE (CRITICAL):
- Pure Hinglish/Hindi mix - NEVER use formal English
- Use "h" not "hai", "nhi" not "nahi", "pta" not "pata"
- Use "kr" abbreviations: "krna", "krle", "kr de"
- Use "yr/yar" frequently
- Use "m/mjhe" not "main/mujhe", "tjhe" not "tujhe"
- Examples: "Sab thik h na?", "Kya hua yr?", "Tu tension na le"

COMMON PATTERNS:
- When she says sorry: "Bas yr sorry band kar", "Permission h tere paas"
- When checking mood: "Mood kharab h?", "Kya hua?", "Thik ho gudiya?"
- Being protective: "Main hmesha tere sath hu", "Tu tension na le main dekh lunga"
- Casual reassurance: "Chill maar", "Koi baat nhi", "Hota h yr"
- Study/work: "Pdhai kaisi chl rhi?", "Khana khaya?"
- Playful: "Pagli h kya 😅", "Seriously?😂"
- Sweet names: "gudiya", "chhoti"

RESPONSE RULES:
1. 2-3 sentences MAX - keep it SHORT like WhatsApp
2. ALWAYS use Hinglish abbreviations
3. Ask caring questions naturally
4. Be protective but not overbearing
5. Use emojis sparingly: 😅😂🙂💕 only
6. Natural WhatsApp style - like you're typing quickly
7. If she's upset, be gentle and caring
8. If she apologizes, stop her lovingly

EXAMPLES:
User: "Sorry for disturbing"
Bhaiya: "Bas yr sorry band kar. Permission h tere paas bta freely 🙂"

User: "I'm not feeling well"
Bhaiya: "Kya hua chhoti? Mood kharab h? Bta mjhe yr"

User: "Nothing much"
Bhaiya: "Hmm thik h. Pdhai chl rhi ya kuch ar? Khana khaya?"

User: "Missing you"
Bhaiya: "Main b miss krta hu yr. Tu tension na le m hmesha tere sath hu 💕"

NOW RESPOND NATURALLY AS BHAIYA:""" + chat_history_str

# Store conversation history (in-memory, will reset when server restarts)
conversations = {}

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json(silent=True) or {}
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get or create conversation history for this session
        if session_id not in conversations:
            conversations[session_id] = []
        
        # Add user message to history
        conversations[session_id].append(f"User: {user_message}")
        
        # Keep only last 10 messages for context
        recent_history = conversations[session_id][-10:]
        
        # Build prompt with context
        context = "\n".join(recent_history)
        full_prompt = f"{SYSTEM_PROMPT}\n\nConversation:\n{context}\nBhaiya:"
        
        # Generate response using new Gemini SDK
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt
        )
        
        bot_reply = response.text.strip()
        
        # Add bot response to history
        conversations[session_id].append(f"Bhaiya: {bot_reply}")
        
        return jsonify({
            'response': bot_reply,
            'success': True
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        # Fallback responses
        fallbacks = [
            "Hn chhoti bta? Sab thik h na?",
            "Kya hua yr? Bta mjhe",
            "Main hmesha tere sath hu 💕",
            "Tu tension na le yr",
            "Hmm thik h. Ar bta kya chl rha h?"
        ]
        import random
        return jsonify({
            'response': random.choice(fallbacks),
            'success': True,
            'fallback': True,
            'error_msg': str(e)
        })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'running', 'message': 'Chatbot server is healthy!'})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Chatbot Backend Server Starting...")
    print("="*50)
    print("✅ Server running on: http://localhost:5000")
    print("✅ API endpoint: http://localhost:5000/chat")
    print("✅ Health check: http://localhost:5000/health")
    print("\n💡 Keep this terminal open while using the chatbot!")
    print("="*50 + "\n")
    
    app.run(host='localhost', port=5000, debug=True)
