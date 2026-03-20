// Tabs and Enhanced Features for Chhoti's Website
// Fixed version: Correctly handles Our Story visibility and adds Audio Memories

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        createTabNavigation();
        setupPhotoAudio(); // Audio on photo click
        setupAdditionalTabs();
    }

    function createTabNavigation() {
        // Create header/nav
        const nav = document.createElement('div');
        nav.id = 'tab-nav';
        nav.innerHTML = `
            <style>
                #tab-nav { position: sticky; top: 0; z-index: 9999; background: linear-gradient(135deg, var(--white), var(--pink-light)); border-bottom: 3px solid var(--pink-soft); box-shadow: 0 5px 20px rgba(255,105,180,0.2); }
                #tab-header { text-align: center; padding: 15px; font-family: 'Pacifico', cursive; font-size: clamp(1.2rem, 3vw, 2rem); background: linear-gradient(135deg, var(--rose), var(--pink-soft)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                #tab-buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; padding: 10px; background: var(--white); }
                .tab-btn { font-family: 'Kalam', cursive; font-size: 0.95rem; padding: 10px 20px; background: transparent; border: 2px solid var(--pink-soft); border-radius: 25px; color: var(--text); cursor: pointer; transition: all 0.3s; font-weight: 600; }
                .tab-btn:hover { background: var(--pink-light); }
                .tab-btn.active { background: linear-gradient(135deg, var(--rose), var(--pink-soft)); color: var(--white); border-color: var(--rose); }
                .tab-panel { display: none; padding-top: 20px; }
                .tab-panel.active { display: block; animation: fadeInPanel 0.5s ease; }
                @keyframes fadeInPanel { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                /* Audio Memories Styles */
                .audio-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                .audio-card { background: var(--white); padding: 15px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); border: 2px solid var(--mist); display: flex; align-items: center; gap: 15px; transition: transform 0.3s; }
                .audio-card:hover { transform: translateY(-5px); border-color: var(--rose); }
                .play-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--pink-soft); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
                .audio-name { font-family: 'Kalam', cursive; font-size: 1rem; color: var(--text); font-weight: 600; }
            </style>
            <div id="tab-header">For My Chhoti - Most Precious Gift I Ever Got In My Life</div>
            <div id="tab-buttons">
                <button class="tab-btn active" data-tab="story">Our Story</button>
                <button class="tab-btn" data-tab="audio-memories">Audio Memories</button>
                <button class="tab-btn" data-tab="gallery">Photo Gallery</button>
                <button class="tab-btn" data-tab="dreams">Dreamed Moments</button>
                <button class="tab-btn" data-tab="chat">Chat with Bhaiya</button>
            </div>
        `;
        document.body.prepend(nav);

        // Intelligently wrap "Our Story" content
        // We select only specific elements to avoid moving scripts or nav
        const storyWrapper = document.createElement('div');
        storyWrapper.id = 'story-panel';
        storyWrapper.className = 'tab-panel active';

        // Move all content nodes that follow the nav into the wrapper, until the scripts at the bottom
        // Strategy: Move everything that isn't the nav and isn't a script tag
        const children = Array.from(document.body.children);
        children.forEach(child => {
            if (child.id !== 'tab-nav' && child.tagName !== 'SCRIPT' && child.id !== 'photoModal' && child.id !== 'floatContainer') {
                storyWrapper.appendChild(child);
            }
        });

        // Insert wrapper after nav
        nav.after(storyWrapper);

        // Force visible on Our Story sections in case observer missed them
        setTimeout(() => {
            const sections = storyWrapper.querySelectorAll('section');
            sections.forEach(sec => sec.classList.add('visible'));
            storyWrapper.style.display = 'block'; // Ensure block display
        }, 500);

        // Tab Switching Logic
        const tabs = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.tab-panel'); // Will include new ones we add

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab');

                // Toggle Buttons
                tabs.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');

                // Toggle Panels
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                const targetPanel = document.getElementById(targetId + '-panel');
                if (targetPanel) targetPanel.classList.add('active');

                // Load content if needed
                if (targetId === 'audio-memories' && !window.audioMemoriesLoaded) loadAudioMemories();
                if (targetId === 'gallery' && !window.galleryLoaded) loadGallery();
                if (targetId === 'dreams' && !window.dreamsLoaded) loadDreams();
            });
        });
    }

    function setupAdditionalTabs() {
        // 1. Audio Memories Panel
        const audioPanel = document.createElement('div');
        audioPanel.id = 'audio-memories-panel';
        audioPanel.className = 'tab-panel';
        audioPanel.innerHTML = `
            <div class="container" style="padding: 20px;">
                <h2 class="section-title">Our Call Recordings & Audio Memories</h2>
                <div class="audio-grid" id="audio-grid-container"></div>
            </div>
        `;
        document.body.appendChild(audioPanel);

        // 2. Photo Gallery Panel
        const galleryPanel = document.createElement('div');
        galleryPanel.id = 'gallery-panel';
        galleryPanel.className = 'tab-panel';
        galleryPanel.innerHTML = `
            <div class="container" style="padding: 20px;">
                <h2 class="section-title">Our Precious Memories</h2>
                <div class="photo-grid" id="dynamic-gallery"></div>
            </div>
        `;
        document.body.appendChild(galleryPanel);

        // 3. Dreamed Moments Panel
        const dreamsPanel = document.createElement('div');
        dreamsPanel.id = 'dreams-panel';
        dreamsPanel.className = 'tab-panel';
        dreamsPanel.innerHTML = `
            <div class="container" style="padding: 20px;">
                <h2 class="section-title">Moments I Dream Of</h2>
                <div class="photo-grid" id="dreams-grid"></div>
            </div>
        `;
        document.body.appendChild(dreamsPanel);

        // 4. Chat Panel
        const chatPanel = document.createElement('div');
        chatPanel.id = 'chat-panel';
        chatPanel.className = 'tab-panel';
        chatPanel.innerHTML = `
            <div class="container" style="padding: 20px;">
                <h2 class="section-title">Chat with Bhaiya</h2>
                 <div style="max-width: 800px; margin: 0 auto; background: var(--white); border-radius: 25px; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1); overflow: hidden; border: 3px solid var(--pink-soft);">
                    <div style="background: linear-gradient(135deg, var(--rose), var(--pink-soft)); color: var(--white); padding: 20px; text-align: center;">
                        <h3 style="font-family: 'Pacifico', cursive; font-size: 1.8rem;">Your Bhaiya is Here</h3>
                    </div>
                    <div style="background: var(--cream); padding: 20px; font-family: 'Kalam', cursive; font-size: 1rem; line-height: 1.8; border-bottom: 3px dashed var(--pink-soft); color: var(--text);">
                        Baat karlo atleast yha pe 😊<br>
                        Real life me nhi krni to.<br>
                        Jab bhi mann kre yha aake mann halka kar skte ho.<br>
                        Jo b kuch bolna ho yha bol skte ho - baate kahi save nhi hoti, kisi k paas nhi jaati
                    </div>
                    <div id="chatMessages" style="height: 400px; overflow-y: auto; padding: 20px; background: linear-gradient(135deg, var(--pink-light), var(--lavender));">
                        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--rose), var(--pink-soft)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; flex-shrink: 0; font-weight: bold;">B</div>
                            <div class="chat-bubble" style="background: var(--white); border-bottom-left-radius: 5px;">Kaisi h meri chhoti? Sb thik?</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; padding: 20px; background: var(--white); border-top: 3px solid var(--pink-soft);">
                        <input type="text" id="chatInput" placeholder="Type yr message..." style="flex: 1; padding: 12px 20px; border: 2px solid var(--pink-soft); border-radius: 25px; font-family: 'Poppins', sans-serif; font-size: 1rem; outline: none;">
                        <button id="chatSend" style="padding: 12px 30px; background: linear-gradient(135deg, var(--rose), var(--pink-soft)); color: var(--white); border: none; border-radius: 25px; font-family: 'Kalam', cursive; font-size: 1rem; cursor: pointer; font-weight: 600;">Send</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(chatPanel);
        setupChat();
    }

    function setupPhotoAudio() {
        // Only run if "Our Story" or "Photo Gallery" images are present
        const images = document.querySelectorAll('#story-panel .polaroid'); // Images in Story (original)
        // We'll attach this dynamically for the Gallery too
    }

    async function loadAudioMemories() {
        const container = document.getElementById('audio-grid-container');
        container.innerHTML = '';
        const limit = 51; // 51 audio files

        let currentlyPlaying = null;

        for (let i = 1; i <= limit; i++) {
            const fileName = `audio/audio${i}.m4a`;
            // Check if exists (head request)
            try {
                const res = await fetch(fileName, { method: 'HEAD' });
                if (res.ok) {
                    const card = document.createElement('div');
                    card.className = 'audio-card';
                    card.innerHTML = `
                        <button class="play-btn">▶</button>
                        <div class="audio-info">
                            <div class="audio-name">Call Recording ${i}</div>
                            <div style="font-size:0.8rem; color:#888;">Audio Memory</div>
                        </div>
                        <audio src="${fileName}" preload="none"></audio>
                    `;

                    const btn = card.querySelector('.play-btn');
                    const audio = card.querySelector('audio');

                    btn.addEventListener('click', () => {
                        if (audio.paused) {
                            if (currentlyPlaying && currentlyPlaying !== audio) {
                                currentlyPlaying.pause();
                                currentlyPlaying.parentElement.querySelector('.play-btn').textContent = '▶';
                            }
                            audio.play();
                            btn.textContent = '⏸';
                            currentlyPlaying = audio;
                        } else {
                            audio.pause();
                            btn.textContent = '▶';
                        }
                    });

                    audio.addEventListener('ended', () => {
                        btn.textContent = '▶';
                    });

                    container.appendChild(card);
                }
            } catch (e) { }
        }
        window.audioMemoriesLoaded = true;
    }

    // Reuse other loaders
    async function loadGallery() {
        const grid = document.getElementById('dynamic-gallery');
        if (!grid) return;
        grid.innerHTML = '';
        let found = 0;

        // This is for the TAB "Photo Gallery"
        // Also attach audio to these
        const audioFiles = [];
        for (let k = 1; k <= 51; k++) audioFiles.push(`audio/audio${k}.m4a`);

        for (let i = 1; i <= 30; i++) {
            for (const ext of ['jpg', 'png', 'jpeg']) {
                try {
                    const res = await fetch(`images/photo${i}.${ext}`, { method: 'HEAD' });
                    if (res.ok) {
                        found++;
                        const polaroid = document.createElement('div');
                        polaroid.className = 'polaroid';
                        polaroid.innerHTML = `
                        <img src="images/photo${i}.${ext}" style="width:100%; height:280px; object-fit:cover; border-radius:5px;">
                        <div class="polaroid-caption">Memory ${found}</div>
                    `;

                        // Attach Audio Click
                        const audioSrc = audioFiles[(found - 1) % audioFiles.length];
                        const audio = new Audio(audioSrc);
                        polaroid.addEventListener('click', () => {
                            audio.play();
                        });

                        grid.appendChild(polaroid);
                        break;
                    }
                } catch (e) { }
            }
        }
    }

    async function loadDreams() {
        const grid = document.getElementById('dreams-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            try {
                const res = await fetch(`dreamed_moments/dream${i}.png`, { method: 'HEAD' });
                if (res.ok) {
                    const polaroid = document.createElement('div');
                    polaroid.className = 'polaroid';
                    polaroid.innerHTML = `
                        <img src="dreamed_moments/dream${i}.png" style="width:100%; height:280px; object-fit:cover; border-radius:5px;">
                        <div class="polaroid-caption">Dream ${i}</div>
                    `;
                    grid.appendChild(polaroid);
                }
            } catch (e) { }
        }
        window.dreamsLoaded = true;
    }

    function setupChat() {
        const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        const systemPrompt = `You are a caring, protective older brother (bhaiya) talking to your chhoti...`;

        const sendBtn = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');

        if (sendBtn && input) {
            sendBtn.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
        }

        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;
            addMessage(message, 'user');
            input.value = '';
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}\nBhaiya:` }] }] })
                });
                const data = await response.json();
                const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'API key missing!';
                addMessage(botResponse, 'bot');
            } catch (error) { addMessage('Beta, API key add kro code me.', 'bot'); }
        }

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px; animation: slideIn 0.3s;' + (sender === 'user' ? 'justify-content: flex-end;' : '');
            if (sender === 'bot') {
                msgDiv.innerHTML = `<div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--rose), var(--pink-soft)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; flex-shrink: 0; font-weight: bold;">B</div><div class="chat-bubble" style="background: var(--white); border-bottom-left-radius: 5px;">${text}</div>`;
            } else {
                msgDiv.innerHTML = `<div class="chat-bubble" style="background: linear-gradient(135deg, var(--lavender), var(--mint)); border-bottom-right-radius: 5px;">${text}</div>`;
            }
            const chatBox = document.getElementById('chatMessages');
            if (chatBox) { chatBox.appendChild(msgDiv); chatBox.scrollTop = chatBox.scrollHeight; }
        }
    }

})();
