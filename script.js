// --- DATABASE & STATE ---
let state = {
    points: parseInt(localStorage.getItem('bb_credits')) || 5,
    sessions: JSON.parse(localStorage.getItem('bb_meetings')) || [],
    market: [
        { id: 1, name: "Advanced Python", mentor: "CodeMaster", cat: "Coding" },
        { id: 2, name: "English Speaking", mentor: "Professor Sarah", cat: "Communication" },
        { id: 3, name: "Digital Portrait Art", mentor: "Leo", cat: "Creative" }
    ]
};

let pendingMentor = null;

// --- PAGE NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Refresh Dynamic Data
    if(pageId === 'discover') renderMarket();
    if(pageId === 'profile') renderVault();
    updateUI();
}

// --- CORE UI UPDATES ---
function updateUI() {
    document.getElementById('balance').innerText = state.points;
}

// --- MARKETPLACE LOGIC ---
function renderMarket() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = state.market.map(item => `
        <div class="glass skill-card">
            <small style="color:var(--neon)">${item.cat}</small>
            <h3 style="margin:10px 0">${item.name}</h3>
            <p style="opacity:0.7">Mentor: ${item.mentor}</p>
            <button class="prime-btn" style="margin-top:15px; width:100%" onclick="openScheduler(${item.id})">Schedule Session</button>
        </div>
    `).join('');
}

// --- SCHEDULING SYSTEM ---
function openScheduler(id) {
    if(state.points < 1) {
        alert("Oops! You need at least 1 credit. Try teaching a session first!");
        return;
    }
    pendingMentor = state.market.find(m => m.id === id);
    document.getElementById('modal-mentor-info').innerText = `Learning ${pendingMentor.name} with ${pendingMentor.mentor}`;
    document.getElementById('schedule-modal').style.display = 'flex';
}

function confirmSchedule() {
    const date = document.getElementById('sched-date').value;
    const time = document.getElementById('sched-time').value;

    if(!date || !time) {
        alert("Please select both date and time.");
        return;
    }

    // Process Transaction
    state.points -= 1;
    state.sessions.push({
        mentor: pendingMentor.mentor,
        skill: pendingMentor.name,
        date: date,
        time: time
    });

    saveData();
    closeModal();
    alert("Success! Session booked. Check your Vault.");
    showPage('profile');
}

// --- TEACHING LOGIC ---
function listNewSkill() {
    const name = document.getElementById('skillName').value;
    const cat = document.getElementById('skillCat').value;
    if(!name) return alert("Please enter a skill name.");

    state.market.push({ id: Date.now(), name, mentor: "You", cat });
    alert("Your skill is now live! Others can barter with you.");
    showPage('discover');
}

function earnCreditManual() {
    state.points += 1;
    saveData();
    updateUI();
    alert("Session simulated! +1 Brain Credit earned.");
}

// --- VAULT (PROFILE) RENDER ---
function renderVault() {
    document.getElementById('vault-points').innerText = state.points;
    const list = document.getElementById('session-list');
    
    if(state.sessions.length === 0) {
        list.innerHTML = "<p style='opacity:0.5'>You haven't scheduled any learning yet.</p>";
    } else {
        list.innerHTML = state.sessions.map(s => `
            <div class="session-item">
                <strong>${s.skill}</strong> with ${s.mentor}<br>
                <small><i class="fas fa-clock"></i> ${s.date} at ${s.time}</small>
            </div>
        `).join('');
    }
}

// --- STORAGE & RESET ---
function saveData() {
    localStorage.setItem('bb_credits', state.points);
    localStorage.setItem('bb_meetings', JSON.stringify(state.sessions));
}

function closeModal() {
    document.getElementById('schedule-modal').style.display = 'none';
}

function resetApp() {
    if(confirm("Wipe all data? This cannot be undone.")) {
        localStorage.clear();
        location.reload();
    }
}

// Initialize
window.onload = () => showPage('home');