let chatData = {
    user: {},
    visits: [],
    notes: [],
    conversations: {},
    inventory: {
        clues: [],
        items: []
    }
};

// Load initial data
async function loadChatData() {
    try {
        const response = await fetch('mychat.json');
        chatData = await response.json();
        updateUI();
    } catch (error) {
        console.error('Error loading chat data:', error);
        // Initialize new user if no data exists
        initializeNewUser();
    }
}

function initializeNewUser() {
    chatData.user = {
        userId: 'user' + Date.now(),
        nickname: 'New Explorer',
        dateJoined: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        preferences: {
            theme: 'dark',
            notifications: true
        }
    };
    saveChatData();
}

function updateUI() {
    updateUserProfile();
    updateChatMessages();
    updateNotesList();
    updateVisitsList();
    updateInventory();
}

function updateUserProfile() {
    document.getElementById('user-nickname').textContent = chatData.user.nickname;
    document.getElementById('user-id').textContent = `ID: ${chatData.user.userId}`;
}

function updateChatMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    if (chatData.conversations['Mrs. Arcot']) {
        chatData.conversations['Mrs. Arcot'].messages.forEach(msg => {
            chatMessages.innerHTML += `
                <div class="chat-message">
                    <strong>${msg.speaker}:</strong> ${msg.content}
                    <div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>
                </div>
            `;
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function updateNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    chatData.notes.forEach(note => {
        notesList.innerHTML += `
            <div class="note-item">
                <strong>${note.character} - ${new Date(note.timestamp).toLocaleString()}</strong>
                <p>${note.content}</p>
                <small>Tags: ${note.tags.join(', ')}</small>
            </div>
        `;
    });
}

function updateVisitsList() {
    const visitsList = document.getElementById('visits-list');
    visitsList.innerHTML = '';
    
    chatData.visits.forEach(visit => {
        visitsList.innerHTML += `
            <div class="note-item">
                <strong>${visit.character}</strong>
                <p>Location: ${visit.location} (${visit.coordinates})</p>
                <p>Visits: ${visit.visitCount}</p>
                <small>Last visit: ${new Date(visit.lastVisit).toLocaleString()}</small>
            </div>
        `;
    });
}

function updateInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    
    if (chatData.inventory.clues.length === 0 && chatData.inventory.items.length === 0) {
        inventoryList.innerHTML = '<p>No items collected yet</p>';
        return;
    }

    if (chatData.inventory.clues.length > 0) {
        inventoryList.innerHTML += '<h4>Clues</h4>';
        chatData.inventory.clues.forEach(clue => {
            inventoryList.innerHTML += `<div class="note-item">${clue}</div>`;
        });
    }

    if (chatData.inventory.items.length > 0) {
        inventoryList.innerHTML += '<h4>Items</h4>';
        chatData.inventory.items.forEach(item => {
            inventoryList.innerHTML += `<div class="note-item">${item}</div>`;
        });
    }
}

async function saveChatData() {
    try {
        const response = await fetch('mychat.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save chat data');
        }
    } catch (error) {
        console.error('Error saving chat data:', error);
    }
}

function editProfile() {
    document.getElementById('edit-nickname').value = chatData.user.nickname;
    document.getElementById('edit-theme').value = chatData.user.preferences.theme;
    new bootstrap.Modal(document.getElementById('profileModal')).show();
}

function saveProfile() {
    chatData.user.nickname = document.getElementById('edit-nickname').value;
    chatData.user.preferences.theme = document.getElementById('edit-theme').value;
    chatData.user.lastActive = new Date().toISOString();
    
    updateUI();
    saveChatData();
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        if (!chatData.conversations['Mrs. Arcot']) {
            chatData.conversations['Mrs. Arcot'] = { 
                messages: [],
                relationship: "neutral",
                questProgress: "none"
            };
        }
        
        const newMessage = {
            id: `msg${Date.now()}`,
            speaker: chatData.user.nickname,
            content: message,
            timestamp: new Date().toISOString(),
            userId: chatData.user.userId
        };
        
        chatData.conversations['Mrs. Arcot'].messages.push(newMessage);
        
        // Update visit data
        const existingVisit = chatData.visits.find(v => v.character === 'Mrs. Arcot');
        if (existingVisit) {
            existingVisit.lastVisit = new Date().toISOString();
            existingVisit.visitCount++;
        } else {
            chatData.visits.push({
                character: 'Mrs. Arcot',
            location: 'Fruit Shop',
            coordinates: 'GL309',
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visitCount: 1,
            discoveredSecrets: []
        });
    }
        
    updateUI();
    saveChatData();
    input.value = '';
        
    // Simulate Mrs. Arcot's response
    setTimeout(() => {
        const response = {
            id: `msg${Date.now()}`,
            speaker: 'Mrs. Arcot',
            content: 'I would be happy to help you with that!',
            timestamp: new Date().toISOString(),
            userId: 'system'
        };
        chatData.conversations['Mrs. Arcot'].messages.push(response);
        updateUI();
        saveChatData();
    }, 1000);
}
}

function addNote() {
const input = document.getElementById('note-input');
const tagsInput = document.getElementById('tags-input');
const note = input.value.trim();
const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);

if (note) {
    const newNote = {
        id: `note${Date.now()}`,
        character: 'Mrs. Arcot',
        timestamp: new Date().toISOString(),
        content: note,
        tags: tags.length ? tags : ['general'],
        userId: chatData.user.userId,
        important: false,
        location: 'Fruit Shop'
    };
    
    chatData.notes.push(newNote);
    updateUI();
    saveChatData();
    
    input.value = '';
    tagsInput.value = '';
}
}

function markNoteImportant(noteId) {
const note = chatData.notes.find(n => n.id === noteId);
if (note) {
    note.important = !note.important;
    updateUI();
    saveChatData();
}
}

function deleteNote(noteId) {
chatData.notes = chatData.notes.filter(n => n.id !== noteId);
updateUI();
saveChatData();
}

// Handle Enter key for message input
document.getElementById('message-input').addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
    sendMessage();
}
});

// Handle Enter key for note input
document.getElementById('note-input').addEventListener('keypress', function(e) {
if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addNote();
}
});

// Handle tags input
document.getElementById('tags-input').addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
    e.preventDefault();
    addNote();
}
});

// Handle theme changes
function updateTheme(theme) {
document.body.className = theme;
chatData.user.preferences.theme = theme;
saveChatData();
}

// Initialize character responses
const characterResponses = {
greeting: [
    "Welcome to my fruit shop!",
    "Hello there! Looking for some fresh fruit?",
    "Ah, a new customer! How can I help you today?"
],
farewell: [
    "Please come again!",
    "Have a wonderful day!",
    "Thank you for visiting!"
]
};

// Get random response
function getRandomResponse(type) {
const responses = characterResponses[type];
return responses[Math.floor(Math.random() * responses.length)];
}

// Update online status
window.addEventListener('online', function() {
saveChatData();
});

window.addEventListener('beforeunload', function() {
chatData.user.lastActive = new Date().toISOString();
saveChatData();
});

// Initialize the chat interface
loadChatData();