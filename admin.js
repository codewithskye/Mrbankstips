let adminMatches = [];
let editingIndex = -1;

// DOM Elements
const matchForm = document.getElementById('match-form');
const adminMatchesList = document.getElementById('admin-matches-list');
const totalMatchesEl = document.getElementById('total-matches');
const liveMatchesEl = document.getElementById('live-matches');
const finishedMatchesEl = document.getElementById('finished-matches');
const successRateEl = document.getElementById('success-rate');

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadAdminMatches();
    updateStatistics();
});

// Initialize admin functionality
function initializeAdmin() {
    loadMatchesFromStorage();
    
    if (matchForm) {
        matchForm.addEventListener('submit', handleMatchSubmission);
    }

    const timeInput = document.getElementById('time');
    if (timeInput) {
        const now = new Date();
        const timeString = now.toTimeString().slice(0, 5);
        timeInput.value = timeString;
    }
}

// Load matches from localStorage
function loadMatchesFromStorage() {
    try {
        const saved = localStorage.getItem('adminMatches');
        if (saved) {
            adminMatches = JSON.parse(saved);
            if (typeof window.matches !== 'undefined') {
                window.matches = [...adminMatches];
            }
        } else {
            generateInitialMatches();
        }
    } catch (error) {
        console.error('Failed to load auto-saved matches:', error);
        generateInitialMatches();
    }
}

// Save matches to localStorage
function saveMatchesToStorage() {
    try {
        localStorage.setItem('adminMatches', JSON.stringify(adminMatches));
    } catch (error) {
        console.error('Failed to auto-save matches:', error);
    }
}

// Handle match form submission
function handleMatchSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(matchForm);
    const matchData = {
        sport: formData.get('sport'),
        date: formData.get('date'),
        time: formData.get('time'),
        home: formData.get('home'),
        away: formData.get('away'),
        prediction: formData.get('prediction'),
        odds: formData.get('odds'),
        score: formData.get('score') || '-',
        status: determineMatchStatus(formData.get('score'))
    };

    if (editingIndex >= 0) {
        adminMatches[editingIndex] = matchData;
        editingIndex = -1;
        showNotification('Match updated successfully!', 'success');
    } else {
        adminMatches.push(matchData);
        showNotification('Match added successfully!', 'success');
    }

    saveMatchesToStorage();

    // ✅ Force storage event so homepage updates instantly (same-tab or not)
    window.dispatchEvent(new StorageEvent('storage', { key: 'adminMatches' }));

    matchForm.reset();
    loadAdminMatches();
    updateStatistics();

    const timeInput = document.getElementById('time');
    if (timeInput) {
        const now = new Date();
        const timeString = now.toTimeString().slice(0, 5);
        timeInput.value = timeString;
    }
}



// Determine match status based on score
function determineMatchStatus(score) {
    if (!score || score === '-' || score.trim() === '') {
        return 'not-started';
    }
    
    if (score.includes('HT') || score.includes('\'')) {
        return 'live';
    }
    
    if (score.match(/\d+-\d+/)) {
        return 'finished';
    }
    
    return 'not-started';
}

// Load and display admin matches
function loadAdminMatches() {
    if (!adminMatchesList) return;

    adminMatchesList.innerHTML = '';

    if (adminMatches.length === 0) {
        adminMatchesList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No matches added yet. Add your first match using the form above.</p>';
        return;
    }

    adminMatches.forEach((match, index) => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.innerHTML = `
            <div class="match-info">
                <strong>${match.home} vs ${match.away}</strong>
                <br>
                <small>${match.sport.toUpperCase()} • ${match.date} • ${match.time} • Prediction: ${match.prediction} • Odds: ${match.odds}</small>
                <br>
                <span class="match-status status-${match.status}">
                    ${match.status === 'not-started' ? 'Not Started' : 
                      match.status === 'live' ? 'Live' : 
                      'Finished: ' + match.score}
                </span>
            </div>
            <div class="match-actions">
                <button class="edit-btn" onclick="editMatch(${index})">
                    <i class='bx bx-edit'></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteMatch(${index})">
                    <i class='bx bx-trash'></i> Delete
                </button>
                <button class="status-btn" onclick="toggleMatchStatus(${index})">
                    <i class='bx bx-refresh'></i> Status
                </button>
            </div>
            <div class="edit-form" id="edit-form-${index}">
                <div class="form-grid">
                    <input type="text" placeholder="Home Team" value="${match.home}" id="edit-home-${index}">
                    <input type="text" placeholder="Away Team" value="${match.away}" id="edit-away-${index}">
                    <input type="time" value="${match.time}" id="edit-time-${index}">
                    <input type="text" placeholder="Prediction" value="${match.prediction}" id="edit-prediction-${index}">
                    <input type="number" step="0.01" placeholder="Odds" value="${match.odds}" id="edit-odds-${index}">
                    <input type="text" placeholder="Score" value="${match.score}" id="edit-score-${index}">
                </div>
                <button class="save-btn" onclick="saveEdit(${index})">Save</button>
                <button class="cancel-btn" onclick="cancelEdit(${index})">Cancel</button>
            </div>
        `;
        adminMatchesList.appendChild(matchItem);
    });
}

// Edit match function
function editMatch(index) {
    const editForm = document.getElementById(`edit-form-${index}`);
    if (editForm) {
        editForm.classList.add('active');
    }
}

// Save edit function
function saveEdit(index) {
    const home = document.getElementById(`edit-home-${index}`).value;
    const away = document.getElementById(`edit-away-${index}`).value;
    const time = document.getElementById(`edit-time-${index}`).value;
    const prediction = document.getElementById(`edit-prediction-${index}`).value;
    const odds = document.getElementById(`edit-odds-${index}`).value;
    const score = document.getElementById(`edit-score-${index}`).value;

    if (home && away && time && prediction && odds) {
        adminMatches[index] = {
            ...adminMatches[index],
            home,
            away,
            time,
            prediction,
            odds,
            score: score || '-',
            status: determineMatchStatus(score)
        };

        if (typeof window.updateMatchFromAdmin === 'function') {
            window.updateMatchFromAdmin(index, adminMatches[index]);
        }

        saveMatchesToStorage();
        loadAdminMatches();
        updateStatistics();
        showNotification('Match updated successfully!', 'success');
    } else {
        showNotification('Please fill in all required fields!', 'error');
    }
}

// Cancel edit function
function cancelEdit(index) {
    const editForm = document.getElementById(`edit-form-${index}`);
    if (editForm) {
        editForm.classList.remove('active');
    }
}

// Delete match function
function deleteMatch(index) {
    if (confirm('Are you sure you want to delete this match?')) {
        adminMatches.splice(index, 1);
        
        if (typeof window.deleteMatchFromAdmin === 'function') {
            window.deleteMatchFromAdmin(index);
        }
        
        saveMatchesToStorage();
        loadAdminMatches();
        updateStatistics();
        showNotification('Match deleted successfully!', 'success');
    }
}

// Toggle match status
function toggleMatchStatus(index) {
    const match = adminMatches[index];
    
    if (match.status === 'not-started') {
        match.status = 'live';
        match.score = '0-0';
    } else if (match.status === 'live') {
        match.status = 'finished';
        match.score = generateRandomScore();
    } else {
        match.status = 'not-started';
        match.score = '-';
    }
    
    if (typeof window.updateMatchFromAdmin === 'function') {
        window.updateMatchFromAdmin(index, match);
    }
    
    saveMatchesToStorage();
    loadAdminMatches();
    updateStatistics();
    showNotification(`Match status updated to ${match.status}!`, 'info');
}

// Generate random score
function generateRandomScore() {
    const home = Math.floor(Math.random() * 5);
    const away = Math.floor(Math.random() * 5);
    return `${home}-${away}`;
}

// Update statistics
function updateStatistics() {
    const total = adminMatches.length;
    const live = adminMatches.filter(m => m.status === 'live').length;
    const finished = adminMatches.filter(m => m.status === 'finished').length;
    
    if (totalMatchesEl) totalMatchesEl.textContent = total;
    if (liveMatchesEl) liveMatchesEl.textContent = live;
    if (finishedMatchesEl) finishedMatchesEl.textContent = finished;
    
    const successRate = finished > 0 ? Math.floor(85 + Math.random() * 15) : 95;
    if (successRateEl) successRateEl.textContent = `${successRate}%`;
}

// Quick Actions Functions
function clearAllMatches() {
    if (confirm('Are you sure you want to clear all matches? This action cannot be undone.')) {
        adminMatches = [];
        if (typeof window.matches !== 'undefined') {
            window.matches = [];
        }
        saveMatchesToStorage();
        loadAdminMatches();
        updateStatistics();
        showNotification('All matches cleared!', 'info');
    }
}

function generateSampleData() {
    const sampleMatches = [
    {
        id: 'match1',
        sport: 'soccer',
        date: 'today',
        time: '17:00',
        home: 'Ilves',
        away: 'Shakhtar Donetsk',
        prediction: '2',
        score: '1:3',
        odds: '1.40',
        status: 'pending'
    },
    {
        id: 'match2',
        sport: 'soccer',
        date: 'today',
        time: '17:00',
        home: 'FK Aktobe',
        away: 'Legia Warszawa',
        prediction: 'X2',
        score: '0:1',
        odds: '1.20',
        status: 'pending'
    },
    {
        id: 'match3',
        sport: 'soccer',
        date: 'today',
        time: '18:00',
        home: 'BK Hacken',
        away: 'FC Spartak Trnava',
        prediction: '1X',
        score: '2:1',
        odds: '1.20',
        status: 'pending'
    },
    {
        id: 'match4',
        sport: 'soccer',
        date: 'today',
        time: '18:30',
        home: 'CFR Cluj',
        away: 'Paksi FC',
        prediction: '1',
        score: '1:1',
        odds: '1.20',
        status: 'pending'
    },
    {
        id: 'match5',
        sport: 'soccer',
        date: 'today',
        time: '19:00',
        home: 'FC Prishtina',
        away: 'Sheriff Tiraspol',
        prediction: 'X2',
        score: '1:3',
        odds: '1.35',
        status: 'pending'
    },
    {
        id: 'match6',
        sport: 'soccer',
        date: 'today',
        time: '19:00',
        home: 'NK Celje',
        away: 'Sabah FK',
        prediction: '1X',
        score: '2:1',
        odds: '1.25',
        status: 'pending'
    },
    {
        id: 'match7',
        sport: 'soccer',
        date: 'today',
        time: '19:00',
        home: "Hapoel Be'er Sheva",
        away: 'Levski Sofia',
        prediction: '1X',
        score: '1X',
        odds: '1.25',
        status: 'pending'
    },
    {
        id: 'match8',
        sport: 'soccer',
        date: 'today',
        time: '20:00',
        home: 'FK Partizan',
        away: 'AEK Larnaca',
        prediction: 'X2',
        score: '0:1',
        odds: '1.30',
        status: 'pending'
    }
    ];
    
    adminMatches = [...adminMatches, ...sampleMatches];
    if (typeof window.matches !== 'undefined') {
        window.matches = [...adminMatches];
    }
    saveMatchesToStorage();
    loadAdminMatches();
    updateStatistics();
    showNotification('Sample data generated!', 'success');
}

function exportMatches() {
    const dataStr = JSON.stringify(adminMatches, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `matches_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Matches exported successfully!', 'success');
}

function refreshLiveScores() {
    adminMatches.forEach(match => {
        if (match.status === 'live') {
            const currentScore = match.score.split('-');
            if (currentScore.length === 2) {
                const home = parseInt(currentScore[0]) + (Math.random() > 0.7 ? 1 : 0);
                const away = parseInt(currentScore[1]) + (Math.random() > 0.7 ? 1 : 0);
                match.score = `${home}-${away}`;
            }
        }
    });
    
    if (typeof window.matches !== 'undefined') {
        window.matches = [...adminMatches];
    }
    saveMatchesToStorage();
    loadAdminMatches();
    showNotification('Live scores refreshed!', 'info');
}

// Generate initial matches if none exist
function generateInitialMatches() {
    adminMatches = [];
    saveMatchesToStorage();
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.admin-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class='bx ${getNotificationIcon(type)}'></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class='bx bx-x'></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'bx-check-circle';
        case 'error': return 'bx-error-circle';
        case 'warning': return 'bx-error';
        default: return 'bx-info-circle';
    }
}

// Auto-save every 30 seconds
setInterval(saveMatchesToStorage, 30000);

// Performance monitoring
function logPerformance(action, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Admin action '${action}' took ${duration.toFixed(2)}ms`);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Admin panel error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Add notification styles
const notificationStyles = `
<style>
.admin-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideInRight 0.3s ease-out;
}

.admin-notification.success {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
}

.admin-notification.error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.admin-notification.warning {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
}

.admin-notification.info {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 0.5rem;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification-content span {
    flex: 1;
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background 0.3s ease;
}

.notification-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);

// To Export functions for external use.
window.adminFunctions = {
    addMatch: (matchData) => {
        adminMatches.push(matchData);
        saveMatchesToStorage();
        loadAdminMatches();
        updateStatistics();
    },
    getMatches: () => adminMatches,
    clearMatches: clearAllMatches,
    exportMatches: exportMatches
};

// document.addEventListener("contextmenu", e => e.preventDefault());
// document.addEventListener("keydown", e => {
//     if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) {
//         e.preventDefault();
//     }
//     if (e.keyCode === 123) {
//         e.preventDefault();
//     }
// });