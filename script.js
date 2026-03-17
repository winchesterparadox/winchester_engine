const roomData = {
    foyer: {
        title: "The Foyer",
        narrative: "The doors close behind you. The air is heavy, but for the first time in hours, it is quiet. Which part of the house calls to you tonight?",
        selection: true
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
        const next = roomData[this.currentRoom].next || 'labyrinth';
        this.transitionTo(next);
    },

    transitionTo(roomId) {
        const roomView = document.getElementById('current-room');
        const content = document.querySelector('.room-content');
        
        roomView.style.opacity = '0';
        content.style.opacity = '0';

        setTimeout(() => {
            if (this.currentRoom !== roomId) {
                this.history.push(this.currentRoom);
            }
            this.currentRoom = roomId;
            this.updateDisplay();
            
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
    },

    updateDisplay() {
        const data = roomData[this.currentRoom];
        document.getElementById('room-title').textContent = data.title;
        const narrative = document.getElementById('narrative-text');
        const actions = document.getElementById('room-actions');

        actions.innerHTML = '';

        if (data.selection) {
            narrative.textContent = data.narrative;
            const corridors = [
                { id: 'grief', label: 'The Grief Chamber' },
                { id: 'career', label: 'The Career Wing' },
                { id: 'relationships', label: 'The Relationship Corridor' },
                { id: 'existential', label: 'The Existential Hall' }
            ];
            corridors.forEach(corridor => {
                const btn = document.createElement('button');
                btn.className = 'btn-primary';
                btn.textContent = corridor.label;
                btn.onclick = () => {
                    mazeManager.wing = corridor.id;
                    mazeManager.depth = 0;
                    this.nextRoom();
                };
                actions.appendChild(btn);
            });
        } else if (data.type === 'maze' && this.currentRoom === 'labyrinth') {
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
    wing: 'grief',
    
    wingContent: {
        grief: {
            tasks: [
                "GRIEF TASK (MEMORY): Visualize a small candle flame. Imagine the person/thing you lost is safe in that light. Breathe with the flicker.",
                "GRIEF TASK (SENSES): Find 3 objects in the room you are in that are older than five years. Touch each one and acknowledge their history.",
                "GRIEF TASK (SOUND): Close your eyes. Find the furthest sound you can hear. Now find the closest (even if it's your own pulse).",
                "GRIEF TASK (BODY): Inhale for 4 seconds, hold for 4, exhale for 8. Feel the weight of the grief leaving with the breath.",
                "GRIEF TASK (COLOR): Find something in your room that is the exact color of a shadow. Focus on it until the edges blur."
            ]
        },
        career: {
            tasks: [
                "CAREER TASK (LOGIC): List 3 items around you that are not productive. They serve no purpose but to be. Just like you, right now.",
                "CAREER TASK (PHYSICAL): Tense your hands into fists as hard as you can for 5 seconds. Release. Feel the 'work' leaving your body.",
                "CAREER TASK (ANCHOR): Find something made of wood or stone. Touch it. It does not care about your deadlines. Be like the stone.",
                "CAREER TASK (SIGHT): Look at the ceiling. Find a crack, a shadow, or a stain. Study it until it looks like a map to somewhere else.",
                "CAREER TASK (SOUND): Turn off any extra noise. Listen to the silence of the House. It doesn't want anything from you."
            ]
        },
        relationships: {
            tasks: [
                "RELATIONSHIP TASK (SELF): Find a mirror or a reflective surface. Look at your own eyes for 10 seconds. You are the only one you can never lose.",
                "RELATIONSHIP TASK (SPACE): Identify two boundaries in your room (walls, doors). Acknowledge that you are safe within these lines.",
                "RELATIONSHIP TASK (TOUCH): Wrap your arms around yourself. Feel the pressure. You are your own constant companion.",
                "RELATIONSHIP TASK (SENSES): Find 2 things that smell like safety. If there are none, imagine the smell of old books or cold rain.",
                "RELATIONSHIP TASK (LOGIC): Name 3 things you are grateful for that don't involve another person. Focus on your own autonomy."
            ]
        },
        existential: {
            tasks: [
                "EXISTENTIAL TASK (VOID): Stare at the darkest corner of the room. Acknowledge that even in the dark, you are still breathing.",
                "EXISTENTIAL TASK (SCALE): Look at your hand. Move one finger. Realize the miracle of that movement in a vast, silent universe.",
                "EXISTENTIAL TASK (SOUND): Hum a single low note for as long as you can. Feel the vibration in your chest. You are an instrument of presence.",
                "EXISTENTIAL TASK (TIME): Watch a clock or a shadow for 30 seconds without moving. Time passes, but you are the anchor.",
                "EXISTENTIAL TASK (COLD): Touch something metal or cold. Let the temperature bring you back to the sharp reality of now."
            ]
        }
    },

    encounters: [
        { type: 'joy', text: "GROUNDING: You are here. Your feet are on the floor. The floor is solid. You are safe in this moment." },
        { type: 'joy', text: "SENSORY: Find something blue. Focus on that blue until it's the only thing in the world." }
    ],

    render(narrativeElem, actionsElem) {
        if (this.depth >= this.requiredDepth) {
            narrativeElem.textContent = "A beam of light cuts through the dust. You see a door made of solid, polished glass. You've found the way out.";
            const btnExit = document.createElement('button');
            btnExit.className = 'btn-primary';
            btnExit.textContent = "Enter the Glass Room";
            btnExit.onclick = () => {
                this.depth = 0;
                journeyManager.transitionTo('glassRoom');
            };
            actionsElem.appendChild(btnExit);
            return;
        }

        const currentTasks = this.wingContent[this.wing].tasks;
        const task = currentTasks[this.depth % currentTasks.length];
        narrativeElem.textContent = `${task} (Depth: ${this.depth}/5)`;
        
        if (Math.random() > 0.7) {
            const encounter = this.encounters[Math.floor(Math.random() * this.encounters.length)];
            const btnEncounter = document.createElement('button');
            btnEncounter.className = 'btn-primary';
            btnEncounter.textContent = "The Rebellion";
            btnEncounter.onclick = () => journeyManager.showDetail(encounter.text);
            actionsElem.appendChild(btnEncounter);
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
        this.depth++;
        journeyManager.updateDisplay();
    }
};

const ambientManager = {
    audio: null,
    isPlaying: false,

    init() {
        if (!this.audio) {
            this.audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-heavy-rain-loop-2393.mp3'); 
            this.audio.loop = true;
            this.audio.volume = 0.4;
        }
    },

    toggle() {
        this.init();
        
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

// Lantern Cursor Logic
const lantern = {
    init() {
        const lanternEl = document.createElement('div');
        lanternEl.id = 'lantern-cursor';
        document.body.appendChild(lanternEl);

        document.addEventListener('mousemove', (e) => {
            lanternEl.style.left = e.clientX + 'px';
            lanternEl.style.top = e.clientY + 'px';
        });
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
        const el = document.createElement('textarea');
        el.value = shareText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        const originalText = button.textContent;
        button.textContent = "Copied to Clipboard";
        setTimeout(() => button.textContent = originalText, 2000);
    }
}

window.addEventListener('load', () => {
    loadProducts();
    ambientManager.init();
    lantern.init();
});

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
