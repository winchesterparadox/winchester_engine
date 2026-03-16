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
        pain: "The memory of a voice that told you that you'd never make it. The heavy chain of expectation.",
        joy: "The silence. The fact that you are the one walking, not being dragged. A dark joke that only you understand.",
        next: "glassRoom",
        nextText: "Look for the Exit"
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

        narrative.textContent = data.narrative;
        actions.innerHTML = '';

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

// Initial state
window.addEventListener('load', () => {
    loadProducts();
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
