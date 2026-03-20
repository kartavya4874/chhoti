import sys
import re

file_path = 'c:\\Users\\karta\\chhoti\\Memories_chhoti\\index.html'
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace CSS variables
    new_vars = '''        :root {
            --pink-light: #FFF5F7;
            --pink-soft: #FFD1DC;
            --peach: #FFE4E1;
            --lavender: #FFF0F5;
            --mint: #FFF5EE;
            --cream: #FFFDD0;
            --rose: #FF9AA2;
            --text: #705D56;
            --white: #FFFFFF;
        }'''
    content = re.sub(r'        :root \{.*?\}', new_vars, content, flags=re.DOTALL)

    # Hero min-height
    content = content.replace('min-height: 100vh;', 'min-height: calc(100vh - 100px);')

    # Remove pseudoelements
    content = re.sub(r'        \.section-title::after \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'        @keyframes twinkle \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'        \.polaroid::before \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'        \.polaroid::after \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'        \.polaroid:hover::after \{.*?\}', '', content, flags=re.DOTALL)

    new_memory_card = '''        .memory-card::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: var(--white);
            width: 25px;
            height: 25px;
            border-radius: 50%;
            box-shadow: 0 5px 15px rgba(255, 105, 180, 0.2);
            border: 4px solid var(--pink-soft);
        }'''
    content = re.sub(r'        \.memory-card::before \{.*?(?=\n        @keyframes heartbeat)', new_memory_card + '\n', content, flags=re.DOTALL)

    content = re.sub(r'        \.memory-content::before \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'        \.sticky-note::before \{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'        \.final-message::before \{.*?\}', '', content, flags=re.DOTALL)

    # Remove Doodles
    content = re.sub(r'<div class="hero-doodle".*?>.*?</div>\n', '', content)

    # Remove 30px gap
    content = content.replace('<div style="height: 30px;"></div>\n\n', '')

    # Audio Tag Toggle
    audio_toggle = '''    </div> <!-- End story-panel -->

    <!-- Floating Music Toggle -->
    <div id="music-toggle" style="position: fixed; bottom: 30px; right: 30px; z-index: 9999; background: var(--pink-soft); width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3); font-size: 1.5rem; transition: transform 0.3s;">
        🎵
    </div>

    <script>'''
    content = content.replace('    </div> <!-- End story-panel -->\n\n    <script>', audio_toggle)

    js_audio = '''        // Cute Soft Background Music
        const bgMusic = new Audio("https://upload.wikimedia.org/wikipedia/commons/e/ea/Music_box.ogg"); // Reliable hotlink
        bgMusic.loop = true;
        bgMusic.volume = 0.25;

        const musicToggle = document.getElementById('music-toggle');
        let isPlaying = false;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.style.transform = 'scale(1)';
                musicToggle.style.opacity = '0.7';
            } else {
                bgMusic.play().catch(e => console.log('Audio autoplay prevented'));
                musicToggle.style.transform = 'scale(1.1)';
                musicToggle.style.opacity = '1';
            }
            isPlaying = !isPlaying;
        });

        document.body.addEventListener('click', () => {
            if (!isPlaying) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicToggle.style.transform = 'scale(1.1)';
                    musicToggle.style.opacity = '1';
                }).catch(e => console.log('Background autoplay prevented'));
            }
        }, { once: true });'''
    content = content.replace('        // Music Player Removed', js_audio)

    content = content.replace('for (let i = 0; i < 20; i++)', 'for (let i = 0; i < 5; i++)')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("SUCCESS")
except Exception as e:
    print("ERROR:", str(e))
