import os
import google.generativeai as genai
from dotenv import load_dotenv
import traceback

load_dotenv('c:\\Users\\karta\\chhoti\\Memories_chhoti\\.env')
key = os.environ.get('GEMINI_API_KEY')
print("Loaded KEY:", key)

genai.configure(api_key=key)

try:
    # 1. Try gemini-1.5-flash as it's the new standard
    print("Testing gemini-1.5-flash...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content('Say hello')
    print("SUCCESS: 1.5-flash")
except Exception as e:
    print("ERROR with 1.5-flash:", str(e))

try:
    # 2. Try the older gemini-pro
    print("Testing gemini-pro...")
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content('Say hello')
    print("SUCCESS: gemini-pro")
except Exception as e:
    print("ERROR with gemini-pro:", str(e))
