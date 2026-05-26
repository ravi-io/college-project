// The `projects` array is now loaded globally from project.js

function tagHtml(t) {
  const labels = {html:'HTML',css:'CSS',js:'JS',api:'API'};
  return `<span class="tag ${t}">${labels[t]}</span>`;
}

function renderCards(filter = 'all') {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? projects : projects.filter(p => p.tags.includes(filter));
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tags = p.tags.join(',');
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="card-top">
        <span class="card-num">#${p.id}</span>
        <div class="card-tags">${p.tags.map(tagHtml).join('')}</div>
      </div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="features">${p.features.map(f => `<span class="feat-chip">✓ ${f}</span>`).join('')}</div>
      <div class="skills-row">
        <span class="skills-label">Skills:</span>
        <span class="skills-val">${p.skills}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCards(tag, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCards(tag);
}

function scrollToProjects() {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

function showToast() {
  const t = document.getElementById('toast');
  if (t) {
    t.innerHTML = `<div class="toast-dot"></div> PDF download started! 🎉`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
}

function showToastMessage(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.innerHTML = `<div class="toast-dot"></div> ${msg}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
}

function showToast() {
  const t = document.getElementById('toast');
  if (t) {
    t.innerHTML = `<div class="toast-dot"></div> PDF download started! 🎉`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
}

function showToastMessage(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.innerHTML = `<div class="toast-dot"></div> ${msg}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
}

// ── STATE MANAGEMENT ──

// studentsData is defined globally in students.js
let teamsData = [];

function initData() {
  const uniqueTeamNames = [...new Set(studentsData.map(s => s.teamName))];
  teamsData = uniqueTeamNames.map((name, index) => ({
    id: index + 1,
    name: name
  }));
  renderStudentsList();
  renderTeamsList();
}

function renderStudentsList() {
  const container = document.getElementById('studentListContainer');
  if (!container) return;

  container.innerHTML = '';
  studentsData.forEach((student, i) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.style.animationDelay = `${i * 0.03}s`;

    const seedName = student.name ? encodeURIComponent(student.name) : student.id;
    const avatarStyle = student.gender === 'Female' ? 'lorelei' : 'micah';
    const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seedName}`;
    const teamName = student.teamName || 'No Team';

    card.innerHTML = `
      <span class="student-card-id">#${student.id}</span>
      <div class="student-avatar-container">
        <img class="student-avatar" src="${avatarUrl}" alt="${student.name}">
      </div>
      <h3 class="student-card-name">${student.name}</h3>
      <div class="student-card-badges">
        <span class="student-card-badge">${student.course || 'MCA'}</span>
        <span class="student-card-badge">${student.semester || 'Sem-2'}</span>
      </div>
      <div class="student-card-team">
        <span class="student-team-label">Team:</span>
        <span class="student-team-name">${teamName}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderTeamsList() {
  const container = document.getElementById('teamListContainer');
  if (!container) return;

  container.innerHTML = '';
  teamsData.forEach((team, i) => {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.style.animationDelay = `${i * 0.05}s`;

    const teamAvatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(team.name)}`;
    const members = studentsData.filter(s => s.teamName === team.name);

    let membersHtml = '';
    if (members.length > 0) {
      membersHtml = members.map(m => {
        const mSeedName = m.name ? encodeURIComponent(m.name) : m.id;
        const mAvatarStyle = m.gender === 'Female' ? 'lorelei' : 'micah';
        const mAvatarUrl = `https://api.dicebear.com/7.x/${mAvatarStyle}/svg?seed=${mSeedName}`;
        return `
          <div class="team-member-item">
            <div class="team-member-avatar">
              <img src="${mAvatarUrl}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="team-member-info">
              <span class="team-member-name">${m.name}</span>
              <span class="team-member-meta">${m.course} · ${m.semester}</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      membersHtml = `<span class="member-empty">No students assigned</span>`;
    }

    card.innerHTML = `
      <span class="team-card-id">T${team.id}</span>
      <div class="team-header">
        <div class="team-avatar-container">
          <img class="team-avatar" src="${teamAvatarUrl}" alt="${team.name}">
        </div>
        <div class="team-info">
          <h3 class="team-card-title">${team.name}</h3>
          <span class="team-member-count">${members.length} Member${members.length === 1 ? '' : 's'}</span>
        </div>
      </div>
      <div class="team-members-list">
        ${membersHtml}
      </div>
    `;
    container.appendChild(card);
  });
}

// Inline directory view and navigation controls
function switchMainView(view) {
  const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
  const toggleStudentsBtn = document.getElementById('toggleStudentsBtn');
  const paneProjects = document.getElementById('paneProjects');
  const paneStudentsAndTeams = document.getElementById('paneStudentsAndTeams');

  if (view === 'projects') {
    toggleProjectsBtn.classList.add('active');
    toggleStudentsBtn.classList.remove('active');
    paneProjects.classList.remove('hidden');
    paneStudentsAndTeams.classList.add('hidden');
  } else {
    toggleProjectsBtn.classList.remove('active');
    toggleStudentsBtn.classList.add('active');
    paneProjects.classList.add('hidden');
    paneStudentsAndTeams.classList.remove('hidden');
  }
}

function switchSubView(view) {
  const subTabStudents = document.getElementById('subTabStudents');
  const subTabTeams = document.getElementById('subTabTeams');
  const subPaneStudents = document.getElementById('subPaneStudents');
  const subPaneTeams = document.getElementById('subPaneTeams');

  if (view === 'students') {
    subTabStudents.classList.add('active');
    subTabTeams.classList.remove('active');
    subPaneStudents.classList.remove('hidden');
    subPaneTeams.classList.add('hidden');
  } else {
    subTabStudents.classList.remove('active');
    subTabTeams.classList.add('active');
    subPaneStudents.classList.add('hidden');
    subPaneTeams.classList.remove('hidden');
  }
}

function showStudents() {
  switchMainView('students');
  switchSubView('students');
  document.getElementById('paneStudentsAndTeams').scrollIntoView({ behavior: 'smooth' });
}

function showTeams() {
  switchMainView('students');
  switchSubView('teams');
  document.getElementById('paneStudentsAndTeams').scrollIntoView({ behavior: 'smooth' });
}

function scrollToProjects() {
  switchMainView('projects');
  document.getElementById('paneProjects').scrollIntoView({ behavior: 'smooth' });
}

// ── INTERACTIVE NEON PLAYGROUND LOGIC ──
const simulatorIdeas = {
  easy: {
    'html-css': [
      { title: "Landing Page for Space Tourism", desc: "Create a beautiful multi-section landing page displaying space travels using grids and parallax scrolling.", skills: "CSS Grid · Parallax · Keyframes" },
      { title: "Recipe Card Book", desc: "Build a styled responsive digital recipe catalog with glassmorphism hover transitions.", skills: "Flexbox · Glassmorphism · Transitions" }
    ],
    javascript: [
      { title: "Tip Calculator App", desc: "A simple calculator to divide bills and tips dynamically among friends.", skills: "DOM Input · Math functions" },
      { title: "Digital Counter Board", desc: "Scorekeeper board with animation triggers and reset functions.", skills: "Event Listeners · Element styling" }
    ],
    api: [
      { title: "Random Dog Fetcher", desc: "Loads random dog images from a public API with smooth fade-in animations.", skills: "fetch() · Promises · CSS opacity transitions" }
    ]
  },
  medium: {
    'html-css': [
      { title: "Dashboard Sidebar Nav Layout", desc: "A premium dashboard landing layout with collapsible sidebars and dark/light modes.", skills: "CSS variables · Flexbox positioning" }
    ],
    javascript: [
      { title: "Pomodoro Focus Timer", desc: "Build a study timer that switches between work sessions and short breaks with sound effects.", skills: "setInterval() · HTML5 Audio · Tab focus API" },
      { title: "Interactive Canvas Paint App", desc: "Create a web-based drawing canvas where users can change colors, brush size, and clear screen.", skills: "HTML5 Canvas · Mouse coordinates tracking" }
    ],
    api: [
      { title: "Crypto Currency Tracker", desc: "Fetch live prices of top cryptocurrencies and display dynamic price changes.", skills: "Coingecko API · JSON parsing · DOM insertion" },
      { title: "Dictionary App", desc: "Fetches definitions, synonyms, and pronunciation audio files using a free dictionary API.", skills: "Async/Await · Audio play() · Fetch API" }
    ]
  },
  hard: {
    'html-css': [
      { title: "3D Cuboid Showcase Layout", desc: "An interactive portfolio page showcasing projects on the faces of a rotatable 3D HTML/CSS cube.", skills: "3D Transforms · Perspective properties" }
    ],
    javascript: [
      { title: "Virtual Music Synth Keyboard", desc: "Build a musical keyboard simulator supporting polyphonic synthesized sounds and interactive UI scales.", skills: "Web Audio API · Keydown events listener" },
      { title: "Classic Snake Game", desc: "Create the nostalgic snake game inside HTML canvas with speed acceleration and scoreboard.", skills: "Grid math · Collision detection · Array shifts" }
    ],
    api: [
      { title: "Github Profiler Dashboard", desc: "Fetch developer profile, repositories, and language statistics using Github REST API.", skills: "Async API calls · GitHub OAuth Token basics · SVGs" }
    ]
  }
};

let selectedDifficulty = 'easy';
let selectedTech = 'html-css';

document.addEventListener('DOMContentLoaded', () => {
  const diffButtons = document.querySelectorAll('#diffOptions .config-btn');
  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      diffButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.val;
    });
  });

  const techButtons = document.querySelectorAll('#techOptions .config-btn');
  techButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      techButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTech = btn.dataset.val;
    });
  });
});

let isRunningSimulator = false;
function runProjectSimulator() {
  if (isRunningSimulator) return;
  isRunningSimulator = true;

  const consoleBody = document.getElementById('consoleBody');
  const btn = document.getElementById('btnRunSimulator');
  btn.disabled = true;
  btn.innerText = '⚡ Compiling...';

  // Remove trailing prompt
  const lastLine = consoleBody.querySelector('.prompt');
  if (lastLine) lastLine.remove();

  const addLine = (text, type = '') => {
    const p = document.createElement('div');
    p.className = `console-line ${type}`;
    p.innerText = text;
    consoleBody.appendChild(p);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  };

  addLine(`guest@mca-sem2:~$ ./compile-project.sh --diff=${selectedDifficulty} --tech=${selectedTech}`, 'prompt');

  setTimeout(() => {
    addLine(`[SYSTEM] Connecting to project ideas database...`, 'loading');
    setTimeout(() => {
      addLine(`[SUCCESS] Connection established. Status: 200 OK`, 'success');
      setTimeout(() => {
        addLine(`[COMPILING] Generating project structure for "${selectedDifficulty}" difficulty...`, 'loading');
        setTimeout(() => {
          addLine(`[COMPILING] Optimizing stack requirements for "${selectedTech}"...`, 'loading');
          setTimeout(() => {
            // Select random idea
            const list = simulatorIdeas[selectedDifficulty][selectedTech];
            const idea = list[Math.floor(Math.random() * list.length)];

            // Insert custom card output
            const card = document.createElement('div');
            card.className = 'console-output-card';
            card.innerHTML = `
              <span class="console-output-tech">${selectedTech.toUpperCase()} · ${selectedDifficulty.toUpperCase()}</span>
              <h4>💡 Project: ${idea.title}</h4>
              <p>${idea.desc}</p>
              <div style="font-size: 11px; color: rgba(255,255,255,0.4);"><strong>Stack:</strong> ${idea.skills}</div>
            `;
            consoleBody.appendChild(card);
            consoleBody.scrollTop = consoleBody.scrollHeight;

            const pPrompt = document.createElement('div');
            pPrompt.className = 'console-line prompt';
            pPrompt.innerHTML = 'guest@mca-sem2:~$ <span class="cursor-blink">|</span>';
            consoleBody.appendChild(pPrompt);
            consoleBody.scrollTop = consoleBody.scrollHeight;

            isRunningSimulator = false;
            btn.disabled = false;
            btn.innerText = '⚡ Run Code Compiler';
          }, 600);
        }, 500);
      }, 500);
    }, 500);
  }, 400);
}

initData();

renderCards();

// Bind functions to window to support inline HTML event handlers in ES Module scope
window.switchMainView = switchMainView;
window.switchSubView = switchSubView;
window.filterCards = filterCards;
window.showStudents = showStudents;
window.showTeams = showTeams;
window.scrollToProjects = scrollToProjects;
window.runProjectSimulator = runProjectSimulator;

