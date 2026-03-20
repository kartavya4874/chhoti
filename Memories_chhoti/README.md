# Setup Instructions for Enhanced Website

## Quick Start

1. **Get Gemini API Key** (Free)
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Open `index.html` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual key

2. **Add Your Content**
   - **images/** - Add photos (photo1.jpg, photo2.jpg, etc.)
   - **audio/** - Extract your audio zip and rename files (song1.mp3, song2.mp3, etc.)
   - **video/** - Add your video file as `video.mp4`
   - **dreamed_moments/** - AI-generated images will be added here

3. **Run the Website**
   ```bash
   # Option 1: Python (if installed)
   python -m http.server 8000
   # Then open: http://localhost:8000
   
   # Option 2: Use VS Code Live Server extension
   # Right-click index.html > "Open with Live Server"
   ```

## File Naming Conventions

### Images Folder
Supported names: `photo1.jpg`, `photo2.jpg`, `image1.png`, `pic1.jpg`, etc.
- The website will automatically detect and display all images
- Supports: .jpg, .jpeg, .png, .webp

### Audio Folder
Supported names: `song1.mp3`, `song2.mp3`, `audio1.mp3`, `music1.mp3`, etc.
- Hover over cards to play songs
- Supports: .mp3, .wav, .ogg

### Video Folder
Supported names: `video.mp4`, `background.mp4`, `memory.mp4`
- Used for both background and video bite tab
- Supports: .mp4, .webm

### Dreamed Moments Folder
Supported names: `dream1.jpg`, `dream2.jpg`, `moment1.png`, etc.
- AI-generated scenarios of moments together
- Will be generated for you

## Features

### 5 Tabs
1. **Video Bite** - Special video showcase
2. **Photo Gallery** - Beautiful polaroid-style photo gallery
3. **Audio Gallery** - Songs with hover-to-play feature
4. **Dreamed Moments** - AI-generated moments with sub-tabs
5. **Chat with Bhaiya** - AI chatbot with your personality

### Chatbot Personality
- Greets with: "kaisi h meri laado/gudiya/bachhi"
- Uses terms: beta, little one, my baby, my little angel, my princess
- Talks in Hinglish and Hindi naturally
- Caring, playful, and protective
- Privacy: No chat history saved anywhere

## Troubleshooting

**Issue**: Photos/Audio not loading
- Make sure you're running on a local server (not just opening HTML file)
- Check file names match the conventions (photo1.jpg, song1.mp3, etc.)

**Issue**: Chatbot not responding
- Add your Gemini API key in index.html
- Check internet connection
- Verify API key is valid

**Issue**: Video not playing
- Add video file to video/ folder
- Name it: video.mp4, background.mp4, or memory.mp4
- Check browser supports the video format

## Next Steps

1. Upload your audio zip file
2. I'll help you extract and rename the files
3. Generate dreamed moments images with AI
4. Get your Gemini API key
5. Test everything!

---

Made with love for Chhoti - the most precious gift ever received
