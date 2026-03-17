const roomData = {
    foyer: {
        title: "The Foyer",
        narrative: "The doors close behind you. The air is heavy, but for the first time in hours, it is quiet. Nobody is looking at you here.",
        next: "labyrinth",
        nextText: "Enter the Shadows"
    },
    labyrinth: {
        title: "The Labyrinth",
        narrative: "This is the Labyrinth. A thousand clocks ticking, none of them right. You've been here before, haven't you? Where the world told you that you were broken.",
        type: "maze"
    },
    glassRoom: {
        title: "The Glass Room",
        narrative: "Everything is sharp, transparent, and terrifying. You are seen, but in this room, you are the Architect of what you reveal.",
        pain: "The fear of being found 'dirty' or 'wrong' if they look too close. The urge to turn into a Ghost.",
        joy: "The cold, clean feeling of the glass. The realization that shards can be used to build a mosaic, not just a wound.",
        next: "study",
        nextText: "The Architect's Call"
    },
    study: {
        title: "The Architect's Study",
        narrative: "Solid ground. Gold tools. Hammers made of steel. You built this room to keep the monsters out. You hold the blueprints now.",
        rebellion: "The 'Middle Finger' to the fire. You didn't just survive; you expanded. This house is your testimony.",
        next: "foyer",
        nextText: "Walk the Path Again"
    }
};

const journeyManager = {
    currentRoom: 'foyer',
    history: [],

    nextRoom() {
        const next = roomData[this.currentRoom].next;
        this.transitionTo(next);
    },

    transitionTo(roomId) {
        const roomView = document.getElementById('current-room');
        const content = document.querySelector('.room-content');
        
        // CSS Transition trigger
        roomView.style.opacity = '0';
        content.style.opacity = '0';

        setTimeout(() => {
            this.history.push(this.currentRoom);
            this.currentRoom = roomId;
            this.updateDisplay();
            
            // Map roomId to CSS class
            const cssClass = roomId === 'glassRoom' ? 'glass-room' : 
                             roomId === 'study' ? 'architect-study' : roomId;
            
            roomView.className = `room-view ${cssClass} active`;
            roomView.style.opacity = '1';
            content.style.opacity = '1';
            
            document.getElementById('btn-back').style.display = this.history.length > 0 ? 'inline-block' : 'none';
        }, 600);
    },

    goBack() {
        if (this.history.length === 0) return;
        const prev = this.history.pop();
        this.transitionTo(prev);
        this.history.pop(); // Remove it from history twice because transitionTo adds it
    },

    updateDisplay() {
        const data = roomData[this.currentRoom];
        document.getElementById('room-title').textContent = data.title;
        const narrative = document.getElementById('narrative-text');
        const actions = document.getElementById('room-actions');

        actions.innerHTML = '';

        if (data.type === 'maze' && this.currentRoom === 'labyrinth') {
            mazeManager.render(narrative, actions);
        } else {
            narrative.textContent = data.narrative;
            
            if (data.pain) {
                const btnPain = document.createElement('button');
                btnPain.className = 'btn-secondary';
                btnPain.textContent = "The Fire";
                btnPain.onclick = () => this.showDetail(data.pain);
                actions.appendChild(btnPain);
            }

            if (data.joy) {
                const btnJoy = document.createElement('button');
                btnJoy.className = 'btn-primary';
                btnJoy.textContent = "The Rebellion";
                btnJoy.onclick = () => this.showDetail(data.joy);
                actions.appendChild(btnJoy);
            }

            if (data.rebellion) {
                const btnReb = document.createElement('button');
                btnReb.className = 'btn-primary';
                btnReb.textContent = "Reclaim the Hammer";
                btnReb.onclick = () => this.showDetail(data.rebellion);
                actions.appendChild(btnReb);
            }

            const btnNext = document.createElement('button');
            btnNext.className = 'btn-primary';
            btnNext.textContent = data.nextText;
            btnNext.onclick = () => this.nextRoom();
            actions.appendChild(btnNext);
        }
    },

    showDetail(text) {
        const narrative = document.getElementById('narrative-text');
        narrative.style.opacity = '0';
        setTimeout(() => {
            narrative.textContent = text;
            narrative.style.opacity = '1';
        }, 300);
    }
};

const mazeManager = {
    depth: 0,
    requiredDepth: 5,
    lastDirection: '',
    
    corridors: [
        "Architect's Task (SIGHT): High on the wall, find 3 small details you've never noticed before. Focus on their shape.",
        "Architect's Task (TOUCH): Reach out and touch the closest surface. Is it cold? Rough? Smooth? Describe it silently.",
        "Architect's Task (SOUND): Close your eyes for 5 seconds. Identify two distinct sounds, no matter how faint.",
        "Architect's Task (PHYSICAL): Tense your shoulders to your ears, then drop them. Feel the weight leave. Turn to progress.",
        "Architect's Task (COLOR): Scan the room for something exactly the color of blood. Now find something the color of bone.",
        "Architect's Task (BREATH): Breathe in for four seconds. Hold for four. Out for four. The House breathes with you."
    ],

    encounters: [
        { type: 'joy', text: "GROUNDING: You are here. Your feet are on the floor. The floor is solid. You are safe in this moment." },
        { type: 'joy', text: "SENSORY: Find something blue. Focus on that blue until it's the only thing in the world." }
    ],

    render(narrativeElem, actionsElem) {
        if (this.depth === 0) {
            narrativeElem.textContent = roomData.labyrinth.narrative;
        } else if (this.depth >= this.requiredDepth) {
            narrativeElem.textContent = "A beam of light cuts through the dust. You see a door made of solid, polished glass. You've found the way out.";
            const btnExit = document.createElement('button');
            btnExit.className = 'btn-primary';
            btnExit.textContent = "Enter the Glass Room";
            btnExit.onclick = () => {
                this.depth = 0; // Reset for next time
                journeyManager.transitionTo('glassRoom');
            };
            actionsElem.appendChild(btnExit);
            return;
        } else {
            const randomCorridor = this.corridors[Math.floor(Math.random() * this.corridors.length)];
            narrativeElem.textContent = `${randomCorridor} (Depth: ${this.depth}/5)`;
            
            // Randomly show an encounter detail
            if (Math.random() > 0.6) {
                const encounter = this.encounters[Math.floor(Math.random() * this.encounters.length)];
                const btnEncounter = document.createElement('button');
                btnEncounter.className = encounter.type === 'pain' ? 'btn-secondary' : 'btn-primary';
                btnEncounter.textContent = encounter.type === 'pain' ? "The Fire" : "The Rebellion";
                btnEncounter.onclick = () => journeyManager.showDetail(encounter.text);
                actionsElem.appendChild(btnEncounter);
            }
        }

        const directions = ['North', 'East', 'South', 'West'];
        directions.forEach(dir => {
            const btn = document.createElement('button');
            btn.className = 'btn-maze';
            btn.textContent = dir;
            btn.onclick = () => this.move(dir);
            actionsElem.appendChild(btn);
        });
    },

    move(direction) {
        // Prevent going back immediately if we want to be mean, but for now let's just make it progress
        this.depth++;
        this.lastDirection = direction;
        journeyManager.updateDisplay();
    }
};

const ambientManager = {
    audio: null,
    isPlaying: false,

    init() {
        if (!this.audio) {
            this.audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'); // Using a more stable test link
            // For production, suggest a local file or a more reliable ambient host
            this.audio.loop = true;
            this.audio.volume = 0.3;
        }
    },

    toggle() {
        this.init(); // Ensure initialized on user gesture
        
        if (!this.isPlaying) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                document.getElementById('ambient-status').textContent = "Atmosphere: On";
                document.getElementById('btn-ambient').classList.add('active');
            }).catch(err => {
                console.error("Audio play failed:", err);
                document.getElementById('ambient-status').textContent = "Click again to wake the house";
            });
        } else {
            this.audio.pause();
            this.isPlaying = false;
            document.getElementById('ambient-status').textContent = "Atmosphere: Off";
            document.getElementById('btn-ambient').classList.remove('active');
        }
    }
};

function shareEcho(button) {
    const text = button.closest('.whisper-card').querySelector('.whisper-snippet').textContent;
    const shareText = `${text}\n\nWalk with us: ${window.location.origin}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'An Echo from the Dark',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Share failed', err));
    } else {
        navigator.clipboard.writeText(shareText);
        const originalText = button.textContent;
        button.textContent = "Copied to Clipboard";
        setTimeout(() => button.textContent = originalText, 2000);
    }
}

// Initial state
window.addEventListener('load', () => {
    loadProducts();
    ambientManager.init();
});

// Shop Logic
async function loadProducts() {
    const shopGrid = document.querySelector('.product-grid');
    if (!shopGrid) return;

    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        
        shopGrid.innerHTML = ''; 
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card glassmorphism';
            productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${product.image}')"></div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-meta">
                        <span class="price">$${product.price}</span>
                        <a href="#" class="btn-secondary buy-btn" style="pointer-events: none; opacity: 0.5;">Coming Soon</a>
                    </div>
                </div>
            `;
            shopGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        shopGrid.innerHTML = '<p>The vault is temporarily locked. Please return soon.</p>';
    }
}
