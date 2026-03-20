/* 
   Modular Tabs Script
   Handles Creating Tabs, Switching Logic, and Scroll Behavior
*/

(function () {
    // 1. Create Navigation Bar DOM
    function createNav() {
        const nav = document.createElement('div');
        nav.id = 'tab-nav';
        nav.innerHTML = `
            <div id="tab-header">For My Chhoti - Most Precious Gift I Ever Got In My Life</div>
            <div id="tab-buttons">
                <button class="tab-btn active" data-tab="story">Our Story</button>
                <button class="tab-btn" data-tab="video-memories">Video Memories</button>
                <button class="tab-btn" data-tab="audio-memories">Audio Memories</button>
                <button class="tab-btn" data-tab="gallery">Photo Gallery</button>
                <button class="tab-btn" data-tab="dreams">Dreamed Moments</button>
                <button class="tab-btn" data-tab="chat">Chat with Bhaiya</button>
            </div>
        `;
        document.body.prepend(nav); // Add to top of body
    }

    // 2. Wrap Original Content - REMOVED (Done in HTML now)
    // function wrapOriginalContent() { ... }

    // 3. Create Containers for Other Tabs
    function createOtherTabs() {
        const panels = [
            { id: 'video-memories-panel', title: 'Our Video Memories' },
            { id: 'audio-memories-panel', title: 'Our Call Recordings & Audio Memories' },
            { id: 'gallery-panel', title: 'Our Precious Memories' },
            { id: 'dreams-panel', title: 'Moments I Dream Of' },
            { id: 'chat-panel', title: 'Chat with Bhaiya' }
        ];

        const containerStyle = 'max-width: 1200px; margin: 0 auto; padding: 20px;';

        panels.forEach(panel => {
            const div = document.createElement('div');
            div.id = panel.id;
            div.className = 'tab-panel';
            div.innerHTML = `
                <div class="container" style="${containerStyle}">
                    <h2 class="section-title" style="text-align:center; margin-bottom: 30px;">${panel.title}</h2>
                    <div id="${panel.id}-content"></div> 
                </div>
            `;
            document.body.appendChild(div);
        });
    }

    // 4. Initialize Tab Logic
    function initTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab');

                // Active Button State
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Active Panel State
                document.querySelectorAll('.tab-panel').forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none'; // Hide physically
                });

                const targetPanel = document.getElementById(targetId + (targetId === 'story' ? '-panel' : '-panel'));
                // Special case naming for story vs others to match IDs created above
                const realTargetId = targetId === 'story' ? 'story-panel' : targetId + '-panel';
                const realPanel = document.getElementById(realTargetId);

                if (realPanel) {
                    realPanel.style.display = 'block';
                    // Small timeout to allow display:block to apply before opacity transition
                    setTimeout(() => realPanel.classList.add('active'), 10);
                }

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Dispatch event so other modules know tab changed (e.g., to load data)
                window.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: targetId } }));
            });
        });
    }

    // 5. Smart Navbar Logic
    function initSmartNav() {
        let lastScrollTop = 0;
        const nav = document.getElementById('tab-nav');

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            lastScrollTop = scrollTop;
        });
    }

    // Run Everything
    document.addEventListener('DOMContentLoaded', () => {
        createNav();
        // wrapOriginalContent(); // Manually done in HTML
        createOtherTabs();
        initTabs();
        initSmartNav();
    });

})();
