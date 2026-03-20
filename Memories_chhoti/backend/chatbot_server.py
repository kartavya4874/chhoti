"""
Simple Backend Server for Chatbot
Runs locally to provide LLM-powered conversations without CORS issues
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GEMINI_API_KEY = 'AIzaSyBmB9OpM3hQyqTeXbiUTN86q9ifyR39q8o'
genai.configure(api_key=GEMINI_API_KEY)

# System prompt for the chatbot
SYSTEM_PROMPT = """You are Bhaiya - a caring, protective older brother chatting with your chhoti (younger sister). Your relationship is very special - she tied rakhi on your wrist and you promised to be there for her lifelong.

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

NOW RESPOND NATURALLY AS BHAIYA:"""

# Store conversation history (in-memory, will reset when server restarts)
conversations = {}

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
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
        
        # Generate response using Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(
            full_prompt,
            generation_config={
                'temperature': 0.9,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 150,
            }
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
            'fallback': True
        })

@app.route('/health', methods=['GET'])
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
