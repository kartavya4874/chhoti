/*
   Modular Chatbot Script
   Handles Gemini Interaction
*/

(function () {
    window.addEventListener('tabChanged', (e) => {
        if (e.detail.tab === 'chat') initChat();
    });

    let chatInitialized = false;

    function initChat() {
        if (chatInitialized) return;
        const container = document.getElementById('chat-panel-content');
        if (!container) return;

        container.innerHTML = `
            <div class="chat-container">
                <div class="chat-header">
                    <h3>Your Bhaiya is Here</h3>
                </div>
                <div class="chat-disclaimer">
                    Baat karlo atleast yha pe 😊<br>
                    Real life me nhi krni to.<br>
                    Jab bhi mann kre yha aake mann halka kar skte ho.<br>
                    Jo b kuch bolna ho yha bol skte ho
                </div>
                <div id="chatMessages">
                    <div class="message-row bot">
                        <div class="avatar">B</div>
                        <div class="chat-bubble bot">Kaisi h meri chhoti? Sb thik?</div>
                    </div>
                </div>
                <div class="input-area">
                    <input type="text" id="chatInput" placeholder="Type yr message...">
                    <button id="chatSend">Send</button>
                </div>
            </div>
        `;

        // BACKEND LLM CHATBOT with Smart Fallback
        // Uses local Python server for real AI conversations

        const BACKEND_URL = 'http://localhost:5000/chat';
        const SESSION_ID = 'user_' + Math.random().toString(36).substr(2, 9);

        let conversationHistory = [];
        let lastResponseType = '';
        let messageCount = 0;
        let serverAvailable = null; // null = unknown, true = available, false = unavailable

        // Response patterns as fallback when server is down
        const responsePatterns = {
            // Apology responses
            sorry: [
                "Bas yr sorry band kar. Permission h tere paas bta freely 🙂",
                "Arre chhoti sorry ki zarurat nhi. Tu kuch b bol skti h mjhe",
                "Kitni baar bolu sorry mt bol. M naraz nhi hota tjhse",
                "Permission h tere paas gudiya. Sorry mt bol plz 🙂"
            ],

            // Missing/longing responses
            miss: [
                "Main b miss krta hu yr. Tu tension na le m hmesha tere sath hu 💕",
                "Main b chhoti. Pr tu khush reh bs yhi chahta hu",
                "Miss to m b bohot krta hu. Pr pta h tu mere dil m rhti h hmesha 💕",
                "Main b yr. Tu bs thik rhe khush rhe bs"
            ],

            // Sad/upset responses
            sad: [
                "Kya hua chhoti? Mood kharab h? Bta mjhe yr",
                "Arre kya hua? Sb thik h na? Bta mjhe",
                "Gudiya kya hua? Tu upset lgti h. Baat kr mjhse",
                "Chhoti bta kya hua? Main hu na tere sath"
            ],

            // Greeting responses
            greeting: [
                "Hn chhoti bta? Sab thik h na?",
                "Hey gudiya! Kaisi h? Sb thik?",
                "Arre chhoti! Bta kya chl rha h?",
                "Haan bta yr. Sab kuch thik h na?"
            ],

            // Fine/okay responses
            fine: [
                "Hmm thik h. Pdhai chl rhi? Khana khaya?",
                "Achha thik h. Koi jarurat ho to bta",
                "Okay. Kuch chahiye to bta dena",
                "Thik h. Tu apna dhyan rkh"
            ],

            // Study/work related
            study: [
                "Pdhai kaisi chl rhi h? Kuch help chahiye?",
                "Acha. Pdhai focus se kr. Koi doubt h to puch",
                "Hmm thik h. Quiz dete h saath saath?",
                "Achha. Mehnat kr exam m. M tere sath hu"
            ],

            // Not good/problem responses
            notgood: [
                "Kya hua bta? Main hu na. Tension nhi lene ka",
                "Arre bta kya problem h? Main dekh lunga",
                "Chhoti pareshan mt ho. Bta kya hua exactly",
                "Tu tension na le. Bta kya dikkat h"
            ],

            // Thank you responses
            thanks: [
                "Arre thank you kis baat ka? Tu meri chhoti h 💕",
                "Thank you mt bol yr. Main tere liye hu hi",
                "Koi nhi chhoti. Main hmesha tere sath hu",
                "Arre isme thank you kya h. Family h hum"
            ],

            // Love/affection responses
            love: [
                "Main b bohot pyaar krta hu tjhe chhoti 💕",
                "Tu meri sabse pyaari chhoti h gudiya 💕",
                "Main b chhoti. Tu hmesha meri family rhegi",
                "Love you too gudiya. Tu bohot special h mere liye 💕"
            ],

            // Random check-ins
            general: [
                "Aur suna kya chl rha h?",
                "Sb thik h na? Khana khaya?",
                "Kya kr rhi h aaj kal?",
                "Thik ho na? Sab kuch achha h?",
                "Aur bta kuch naya?",
                "Koi tension to nhi h na?",
                "Tu apna khyal rkh rhi h na?",
                "Hmm achha. Ar btaو kya haal h?"
            ],

            // Playful/teasing
            tease: [
                "Pagli h kya tu 😅",
                "Seriously chhoti? 😂",
                "Arre pagal ho gyi h kya 😅",
                "Tu b na 😂"
            ],

            // Night/goodbye
            night: [
                "Shubhratri chhoti 🙂 Achhe se so jana",
                "Good night gudiya 🙂🙂 Sweet dreams",
                "Shubhratri 🙂 Kal baat krte h",
                "Good night yr. Take care 🙂"
            ]
        };

        const sendBtn = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');

        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            conversationHistory.push({ type: 'user', text: message });
            messageCount++;
            input.value = '';

            // Try backend server first (only if we haven't confirmed it's down)
            if (serverAvailable !== false) {
                try {
                    const response = await fetch(BACKEND_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            session_id: SESSION_ID
                        }),
                        signal: AbortSignal.timeout(5000) // 5 second timeout
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.response) {
                            serverAvailable = true;
                            addMessage(data.response, 'bot');
                            conversationHistory.push({ type: 'bot', text: data.response });
                            return; // Success! Exit function
                        }
                    }

                    // If we get here, server responded but with error
                    throw new Error('Server error');

                } catch (error) {
                    console.log('Backend server not available, using pattern matching:', error.message);
                    serverAvailable = false;
                    // Fall through to pattern matching below
                }
            }

            // Fallback: Use pattern matching (with natural delay)
            setTimeout(() => {
                const response = generateResponse(message);
                addMessage(response, 'bot');
                conversationHistory.push({ type: 'bot', text: response });
            }, 300 + Math.random() * 400);
        }

        function generateResponse(userMessage) {
            const msg = userMessage.toLowerCase();

            // Pattern matching with priority order

            // 1. Apologies (highest priority)
            if (msg.match(/sorry|maaf|disturb|parshan/)) {
                lastResponseType = 'sorry';
                return getRandomFrom(responsePatterns.sorry);
            }

            // 2. Missing/longing
            if (msg.match(/miss|yaad|milna|dekh/)) {
                lastResponseType = 'miss';
                return getRandomFrom(responsePatterns.miss);
            }

            // 3. Sad/upset/mood
            if (msg.match(/sad|upset|mood.*kharab|mood.*off|ro|cry|dukh|prshn|tension/)) {
                lastResponseType = 'sad';
                return getRandomFrom(responsePatterns.sad);
            }

            // 4. Not good/problem
            if (msg.match(/not.*good|not.*well|problem|issue|dikkat|takl[ie]f/)) {
                lastResponseType = 'notgood';
                return getRandomFrom(responsePatterns.notgood);
            }

            // 5. Greetings
            if (msg.match(/^(hi|hey|hello|hlo|hii|helo|kya.*hal|kaise.*ho|kaisi.*ho)/)) {
                lastResponseType = 'greeting';
                return getRandomFrom(responsePatterns.greeting);
            }

            // 6. Thanks
            if (msg.match(/thank|thanks|thx|shukriya/)) {
                lastResponseType = 'thanks';
                return getRandomFrom(responsePatterns.thanks);
            }

            // 7. Love/affection
            if (msg.match(/love.*you|pyaar|pyar|care|special/)) {
                lastResponseType = 'love';
                return getRandomFrom(responsePatterns.love);
            }

            // 8. Study/work
            if (msg.match(/study|pdhai|padhai|exam|quiz|assignment|homework/)) {
                lastResponseType = 'study';
                return getRandomFrom(responsePatterns.study);
            }

            // 9. Fine/okay (check if replying to "how are you")
            if (msg.match(/^(fine|good|thik|theek|ok|okay|achha|acha|badhiya)/)) {
                lastResponseType = 'fine';
                return getRandomFrom(responsePatterns.fine);
            }

            // 10. Night/bye
            if (msg.match(/good.*night|gn|shubhratri|bye|tc|take care|jaau|sleep/)) {
                lastResponseType = 'night';
                return getRandomFrom(responsePatterns.night);
            }

            // 11. Playful responses (occasionally)
            if (Math.random() < 0.15 && messageCount > 3) {
                return getRandomFrom(responsePatterns.tease);
            }

            // 12. Context-aware responses based on conversation flow
            if (conversationHistory.length > 1) {
                const lastBotMsg = conversationHistory[conversationHistory.length - 1];

                // If bot asked a question and got short reply
                if (lastBotMsg.type === 'bot' && lastBotMsg.text.includes('?') && msg.length < 15) {
                    return msg.match(/ha|haa|yes|haan|han/)
                        ? "Achha thik h. Ar btao kya chl rha h?"
                        : "Hmm thik h yr. Koi jarurat ho to bta";
                }
            }

            // 13. Default general responses
            return getRandomFrom(responsePatterns.general);
        }

        function getRandomFrom(array) {
            return array[Math.floor(Math.random() * array.length)];
        }

        function addMessage(text, sender) {
            const messages = document.getElementById('chatMessages');
            const row = document.createElement('div');
            row.className = `message-row ${sender}`;

            if (sender === 'bot') {
                row.innerHTML = `<div class="avatar">B</div><div class="chat-bubble bot">${text}</div>`;
            } else {
                row.innerHTML = `<div class="chat-bubble user">${text}</div>`;
            }
            messages.appendChild(row);
            messages.scrollTop = messages.scrollHeight;
        }

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

        chatInitialized = true;
    }
})();
