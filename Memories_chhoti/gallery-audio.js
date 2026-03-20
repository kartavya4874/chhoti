/*
   Modular Audio & Gallery Script
   Handles Audio Memories and Photo Gallery interactions
*/

(function () {
    let audioLoaded = false;
    let galleryLoaded = false;
    let dreamsLoaded = false;
    let videosLoaded = false;

    // Listen for tab changes
    window.addEventListener('tabChanged', (e) => {
        const tab = e.detail.tab;
        if (tab === 'audio-memories' && !audioLoaded) loadAudioMemories();
        if (tab === 'gallery' && !galleryLoaded) loadGallery();
        if (tab === 'dreams' && !dreamsLoaded) loadDreams();
        if (tab === 'video-memories' && !videosLoaded) loadVideos();
    });

    // 1. Load Audio Memories
    async function loadAudioMemories() {
        const container = document.getElementById('audio-memories-panel-content');
        if (!container) return;

        const grid = document.createElement('div');
        grid.className = 'audio-grid';
        container.appendChild(grid);

        let currentlyPlaying = null;

        // Try to find up to 51 audio files
        for (let i = 1; i <= 51; i++) {
            const fileName = `audio/audio${i}.m4a`;
            try {
                // Check if file exists
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
                            // Stop others
                            if (currentlyPlaying && currentlyPlaying !== audio) {
                                currentlyPlaying.pause();
                                currentlyPlaying.currentTime = 0;
                                const otherBtn = currentlyPlaying.parentElement.querySelector('.play-btn');
                                if (otherBtn) otherBtn.textContent = '▶';
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
                        currentlyPlaying = null;
                        // Auto play next could be added here
                    });

                    grid.appendChild(card);
                }
            } catch (e) { console.log('Error checking audio:', e); }
        }
        audioLoaded = true;
    }

    // 2. Load Photo Gallery (with audio on click)
    async function loadGallery() {
        const container = document.getElementById('gallery-panel-content');
        if (!container) return; // Should exist from tabs-module.js

        const grid = document.createElement('div');
        grid.className = 'photo-grid';
        container.appendChild(grid);

        // Pre-calculate audio mapping
        const audioFiles = [];
        for (let k = 1; k <= 51; k++) audioFiles.push(`audio/audio${k}.m4a`);

        let found = 0;
        const prefixes = ['photo', 'pic', 'image'];
        const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];

        // Search for photos
        for (let i = 1; i <= 50; i++) {
            for (const prefix of prefixes) {
                for (const ext of extensions) {
                    const src = `images/${prefix}${i}.${ext}`;
                    try {
                        const res = await fetch(src, { method: 'HEAD' });
                        if (res.ok) {
                            found++;
                            const polaroid = document.createElement('div');
                            polaroid.className = 'polaroid';
                            polaroid.innerHTML = `
                                 <div class="polaroid-img">
                                    <img src="${src}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
                                 </div>
                                 <div class="polaroid-caption">Memory ${found}</div>
                            `;

                            // Audio interaction
                            const audioSrc = audioFiles[(found - 1) % audioFiles.length];
                            const audio = new Audio(audioSrc);
                            polaroid.addEventListener('click', () => {
                                audio.currentTime = 0;
                                audio.play();
                                // Optional: add visual feedback
                                polaroid.style.transform = 'scale(0.95)';
                                setTimeout(() => polaroid.style.transform = '', 200);
                            });

                            grid.appendChild(polaroid);
                            break;
                        }
                    } catch (e) { }
                }
            }
        }
        galleryLoaded = true;
    }

    // 3. Load Dreams
    async function loadDreams() {
        const container = document.getElementById('dreams-panel-content');
        if (!container) return;

        const grid = document.createElement('div');
        grid.className = 'photo-grid';
        container.appendChild(grid);

        for (let i = 1; i <= 20; i++) {
            const src = `dreamed_moments/dream${i}.png`;
            try {
                const res = await fetch(src, { method: 'HEAD' });
                if (res.ok) {
                    const polaroid = document.createElement('div');
                    polaroid.className = 'polaroid';
                    polaroid.innerHTML = `
                             <div class="polaroid-img">
                                <img src="${src}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
                             </div>
                             <div class="polaroid-caption">Dream ${i}</div>
                    `;
                    grid.appendChild(polaroid);
                }
            } catch (e) { }
        }
        dreamsLoaded = true;
    }

    // 4. Load Videos
    async function loadVideos() {
        const container = document.getElementById('video-memories-panel-content');
        if (!container) return;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            padding: 10px;
        `;
        container.appendChild(grid);

        let currentlyPlaying = null;

        // Try to find up to 20 video files
        for (let i = 1; i <= 20; i++) {
            const fileName = `video/video${i}.mp4`;
            try {
                const res = await fetch(fileName, { method: 'HEAD' });
                if (res.ok) {
                    const card = document.createElement('div');
                    card.style.cssText = `
                        background: var(--white);
                        padding: 15px;
                        border-radius: 15px;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
                        border: 3px solid var(--pink-soft);
                        transition: all 0.3s ease;
                        position: relative;
                    `;
                    card.innerHTML = `
                        <video controls style="width: 100%; max-height: 400px; border-radius: 10px; background: #000;">
                            <source src="${fileName}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div style="text-align: center; margin-top: 12px; font-family: 'Kalam', cursive; font-size: 1.1rem; color: var(--text); font-weight: 600;">
                            Video Memory ${i} 💕
                        </div>
                    `;

                    // Add hover effect
                    card.addEventListener('mouseenter', () => {
                        card.style.transform = 'translateY(-5px)';
                        card.style.boxShadow = '0 15px 40px rgba(255, 105, 180, 0.25)';
                    });
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = '';
                        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                    });

                    const video = card.querySelector('video');
                    video.addEventListener('play', () => {
                        if (currentlyPlaying && currentlyPlaying !== video) {
                            currentlyPlaying.pause();
                        }
                        // Also pause any audio if playing
                        document.querySelectorAll('audio').forEach(a => a.pause());
                        document.querySelectorAll('.play-btn').forEach(b => b.textContent = '▶');

                        currentlyPlaying = video;
                    });

                    grid.appendChild(card);
                }
            } catch (e) { }
        }
        videosLoaded = true;
    }

})();
