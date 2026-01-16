let state = {
    points: parseFloat(localStorage.getItem('bb_credits')) || 5.0,
    sessions: JSON.parse(localStorage.getItem('bb_meetings')) || [],
    market: [
        { id: 1, name: "Neural Network Architecture", mentor: "Dr. Aris", cat: "Coding" },
        { id: 2, name: "Executive Leadership Strategy", mentor: "Sarah Chen", cat: "Communication" },
        { id: 3, name: "FinTech Product Ecosystems", mentor: "Marcus V.", cat: "Creative" }
    ]
};

let pendingMentor = null;

function showPage(pageId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if(pageId === 'discover') renderMarket();
    if(pageId === 'profile') renderVault();
    updateUI();
}

function updateUI() { document.getElementById('balance').innerText = state.points.toFixed(1); }

function renderMarket() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = state.market.map(item => `
        <div class="glass skill-card">
            <small style="color:var(--neon); letter-spacing: 3px; font-weight: bold;">${item.cat.toUpperCase()}</small>
            <h3 style="margin:20px 0; font-size: 1.6rem;">${item.name}</h3>
            <p style="opacity:0.5; font-size: 0.9rem;">Lead Specialist: ${item.mentor}</p>
            <button class="prime-btn" style="margin-top:25px; width:100%" onclick="openScheduler(${item.id})">Initiate Swap</button>
        </div>
    `).join('');
}

function openScheduler(id) {
    if(state.points < 1.0) { alert("Authorization Denied: Insufficient Capital."); return; }
    pendingMentor = state.market.find(m => m.id === id);
    document.getElementById('modal-mentor-info').innerText = `Syncing Protocol: ${pendingMentor.name} with ${pendingMentor.mentor}`;
    document.getElementById('schedule-modal').style.display = 'flex';
}

function confirmSchedule() {
    const date = document.getElementById('sched-date').value;
    const time = document.getElementById('sched-time').value;
    if(!date || !time) return alert("System Error: Incomplete Timestamp.");
    state.points -= 1.0;
    state.sessions.push({ mentor: pendingMentor.mentor, skill: pendingMentor.name, date, time });
    saveData();
    closeModal();
    showPage('profile');
}

function listNewSkill() {
    const name = document.getElementById('skillName').value;
    const cat = document.getElementById('skillCat').value;
    if(!name) return alert("System Error: Specification Required.");
    state.market.push({ id: Date.now(), name, mentor: "Executive User", cat });
    alert("Domain Successfully Deployed.");
    showPage('discover');
}

function earnCreditManual() { state.points += 1.0; saveData(); updateUI(); }

function renderVault() {
    document.getElementById('vault-points').innerText = state.points.toFixed(1);
    const list = document.getElementById('session-list');
    list.innerHTML = state.sessions.length === 0 ? 
        "<p style='opacity:0.3; font-style: italic;'>No active session logs detected in memory.</p>" : 
        state.sessions.map(s => `
            <div class="session-item">
                <strong style="font-size: 1.1rem;">${s.skill}</strong> | Host: ${s.mentor}<br>
                <small style="color:var(--neon); letter-spacing: 1px;">Execution Time: ${s.date} @ ${s.time}</small>
            </div>
        `).join('');
}

function saveData() {
    localStorage.setItem('bb_credits', state.points);
    localStorage.setItem('bb_meetings', JSON.stringify(state.sessions));
}

function closeModal() { document.getElementById('schedule-modal').style.display = 'none'; }

function resetApp() {
    if(confirm("Factory Reset? All distributed memory logs will be purged.")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = () => showPage('home');