const viewRoot = document.querySelector('#app-view');
const breadcrumb = document.querySelector('#breadcrumb-current');
const toastRegion = document.querySelector('#toast-region');
const dialog = document.querySelector('#app-dialog');
const dialogContent = document.querySelector('#dialog-content');

const pathData = [
  { id: 'prompting', title: 'Prompt engineering', subtitle: 'Learn to communicate clearly with AI', icon: '✳', className: 'prompt', status: 'in-progress', progress: 62, lessons: 8, duration: '2.5 hrs', category: 'AI & prompts' },
  { id: 'git', title: 'Git essentials', subtitle: 'Version control without the mystery', icon: '⑂', className: 'git', status: 'in-progress', progress: 35, lessons: 10, duration: '3 hrs', category: 'Git & GitHub' },
  { id: 'first-project', title: 'Build your first project', subtitle: 'Put your new skills into practice', icon: '⌘', className: 'build', status: 'new', progress: 0, lessons: 6, duration: '2 hrs', category: 'Project building' }
];

const icons = { prompting: '✳', git: '⑂', 'first-project': '⌘' };
const labels = { dashboard: 'Overview', paths: 'Learning paths', 'prompt-lab': 'Prompt lab', 'git-playground': 'Git playground', portfolio: 'My portfolio' };
let activeView = 'dashboard';
let commandHistory = [];
let commitCount = 0;

function pathCard(path, compact = false) {
  const statusLabel = path.progress ? 'In progress' : 'Start here';
  return `<article class="path-card" data-path-card="${path.id}">
    <div class="path-icon ${path.className}">${path.icon}</div>
    <div class="path-main"><div class="path-topline"><span class="path-title">${path.title}</span><span class="tag ${path.progress ? 'in-progress' : 'new'}">${statusLabel}</span></div>
      <div class="path-subtitle">${path.subtitle}</div><div class="progress-line"><span style="width:${path.progress}%"></span></div></div>
    <span class="path-percent">${path.progress}%</span>
  </article>`;
}

function renderDashboard() {
  return `<div class="welcome-row"><div><div class="eyebrow"><span class="tiny-spark">✳</span> YOUR LEARNING SPACE</div><h1>Good morning, Mika <span style="font-size:23px">✦</span></h1><p>A little progress each day adds up to big results.</p></div><div class="date-pill"><span>◷</span> Saturday, Nov 7</div></div>
    <section class="hero-card"><div class="hero-copy"><div class="hero-label">YOUR NEXT CHAPTER</div><h2>Make your ideas work<br />better with AI.</h2><p>Learn how to write prompts that turn a fuzzy thought into something you can actually build.</p><button class="button-primary" data-action="open-path" data-id="prompting">Continue learning <span>→</span></button></div><div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><div class="code-window"><div class="window-bar"><i></i><i></i><i></i><span>thoughts-to-things.prompt</span></div><div class="code-body"><div class="code-line"><span class="line-no">01</span><span><span class="code-purple">role:</span> <span class="code-green">"your creative copilot"</span></span></div><div class="code-line"><span class="line-no">02</span><span><span class="code-purple">task:</span> <span class="code-orange">turn ideas into plans</span></span></div><div class="code-line"><span class="line-no">03</span><span><span class="code-purple">context:</span> <span class="code-green">"I'm just getting started"</span></span></div><div class="code-line"><span class="line-no">04</span><span><span class="code-purple">format:</span> <span class="code-orange">clear, actionable steps</span></span></div><div class="code-line"><span class="line-no">05</span><span class="code-muted">// good prompts open doors ↗</span></span></div></div></div><div class="float-chip one"><b>✳</b> Clear context</div><div class="float-chip two">✧ Prompt crafted</div></div></section>
    <div class="stats-grid"><div class="stat-card"><div class="stat-label"><span class="stat-icon">◷</span> Learning time</div><div class="stat-value">4.2h <span class="stat-note positive">↑ 18%</span></div></div><div class="stat-card"><div class="stat-label"><span class="stat-icon">▤</span> Lessons finished</div><div class="stat-value">12 <span class="stat-note">of 24 total</span></div></div><div class="stat-card"><div class="stat-label"><span class="stat-icon">✦</span> Current streak</div><div class="stat-value">4 days <span class="stat-note positive">nice work</span></div></div><div class="stat-card"><div class="stat-label"><span class="stat-icon">◉</span> Skills growing</div><div class="stat-value">6 <span class="stat-note">in your toolkit</span></div></div></div>
    <div class="dashboard-grid"><section><div class="section-heading"><h2>Pick up where you left off</h2><button class="text-link" data-view="paths">All learning paths&nbsp; →</button></div><div class="path-list">${pathData.map(path => pathCard(path)).join('')}</div></section><div class="right-column"><section class="challenge-panel"><div class="challenge-header"><strong>Quick challenges</strong><span>+ earn XP</span></div><div class="challenge-row" data-action="open-challenge" data-id="prompt"><div class="challenge-bullet">✳</div><div><strong>Fix this prompt</strong><small>Prompt lab · 5 min</small></div><span class="challenge-arrow">→</span></div><div class="challenge-row" data-action="open-challenge" data-id="git"><div class="challenge-bullet">⑂</div><div><strong>Make your first commit</strong><small>Git basics · 3 min</small></div><span class="challenge-arrow">→</span></div></section><section class="activity-panel"><h3 class="activity-title">Recent activity</h3><div class="activity-item"><div class="activity-mark">✓</div><div class="activity-copy">Completed <strong>Context is everything</strong><time>Today · 10:42 AM</time></div></div><div class="activity-item"><div class="activity-mark">✳</div><div class="activity-copy">Reached a 4-day learning streak<time>Yesterday · 4:18 PM</time></div></div><div class="activity-item"><div class="activity-mark">⑂</div><div class="activity-copy">Started <strong>Git essentials</strong><time>Nov 4 · 2:05 PM</time></div></div></section></div></div>`;
}

function renderPaths() {
  return `<div class="view-header"><div><div class="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</div><h1>Learning paths</h1><p>Short, hands-on paths designed to help you learn by doing.</p></div><button class="button-primary" data-action="toast" data-message="Your learning plan is up to date.">✦ &nbsp;My plan</button></div><div class="filter-row"><button class="filter-chip active" data-filter="all">All paths</button><button class="filter-chip" data-filter="AI & prompts">AI & prompts</button><button class="filter-chip" data-filter="Git & GitHub">Git & GitHub</button><button class="filter-chip" data-filter="Project building">Project building</button></div><div class="path-library">${pathData.map(p => `<article class="library-card" data-category="${p.category}"><div class="path-icon ${p.className}">${p.icon}</div><h3>${p.title}</h3><p>${p.subtitle}. Bite-sized lessons, practical examples, and small wins along the way.</p><div class="library-meta"><span>▤ ${p.lessons} lessons</span><span>◷ ${p.duration}</span><span>◉ Beginner</span></div><button class="${p.progress ? 'button-secondary' : 'button-primary'}" data-action="open-path" data-id="${p.id}">${p.progress ? 'Continue path' : 'Explore path'} <span style="float:right">→</span></button></article>`).join('')}</div>`;
}

function renderPromptLab() {
  return `<div class="view-header"><div><div class="eyebrow">EXPERIMENT, REFINE, REPEAT</div><h1>Prompt lab</h1><p>Practice giving AI the context it needs to give you useful answers.</p></div><span class="tag in-progress">✳ &nbsp;Practice mode</span></div><div class="lab-layout"><section class="lab-card"><h3>Your prompt</h3><p>Try the challenge: ask an AI to help a beginner plan a simple personal website.</p><textarea id="prompt-input" class="prompt-field" aria-label="Write your prompt" placeholder="Write your prompt here...">Help me make a website.</textarea><div class="prompt-tips"><span>+ Add a role</span><span>+ Be specific about the task</span><span>+ Share context</span><span>+ Request a format</span></div><button class="button-primary" data-action="analyze-prompt">Get feedback <span>→</span></button></section><section class="lab-card"><h3>Prompt coach</h3><p>A little structure can make your request much clearer.</p><div id="prompt-feedback" class="feedback-box"><strong>Ready when you are</strong>Write a prompt, then ask for feedback. Your coach will look for a clear role, task, useful context, and an output format.</div><div style="margin-top:13px;font-size:9px;color:#7e887d">A good prompt is a conversation starter, not a magic spell. ✨</div></section></div><div class="lab-card" style="margin-top:14px"><h3>The prompt recipe</h3><p>Four simple ingredients that make your request easier to understand.</p><div class="prompt-tips" style="margin:0"><span>ROLE &nbsp; Who should AI be?</span><span>TASK &nbsp; What should it do?</span><span>CONTEXT &nbsp; What should it know?</span><span>FORMAT &nbsp; How should it respond?</span></div></div>`;
}

function renderGit() {
  return `<div class="view-header"><div><div class="eyebrow">SAFE TO TRY, EASY TO UNDO</div><h1>Git playground</h1><p>Practice the everyday Git workflow in a friendly little sandbox.</p></div><span class="tag in-progress">⑂ &nbsp;Sandbox repo</span></div><div class="git-layout"><section><div class="terminal-card"><div class="terminal-top"><span>mika@expectik ~/my-first-project</span><span>● connected</span></div><div class="terminal-content" id="terminal-output"><div><span class="prompt-symbol">$</span> git status</div><div class="success">On branch main</div><div class="subtle">Your branch is up to date.</div><div class="subtle">Changes not staged for commit:</div><div> &nbsp; modified: &nbsp;index.html</div><br /><div class="subtle">Try a command: git add, git commit, git status, git log</div>${commandHistory.join('')}</div><form class="terminal-command" id="terminal-form"><span>$</span><input id="terminal-input" autocomplete="off" placeholder="Type a Git command and press Enter" aria-label="Git command" /></form></div><section class="commit-list"><h4>COMMIT HISTORY</h4><div class="commit-item"><span class="commit-dot"></span><div><strong>first commit: project setup</strong><small>a1b2c3d · just now</small></div></div>${commitCount ? `<div class="commit-item"><span class="commit-dot"></span><div><strong>add page update</strong><small>e4f5g6h · just now</small></div></div>` : ''}</section></section><section class="git-stage"><h3>Working directory</h3><p>These files have changes ready to be tracked.</p><div class="file-row"><span>📄 &nbsp;index.html</span><span>modified</span></div><div class="file-row"><span>🎨 &nbsp;styles.css</span><span>modified</span></div><button class="button-primary" data-action="stage-commit">Stage & commit changes <span>→</span></button><div class="terminal-top" style="border:0;padding:16px 0 0;margin-top:12px">WORKFLOW &nbsp; <span>3 steps</span></div><div class="prompt-tips"><span>1 &nbsp; Stage</span><span>2 &nbsp; Commit</span><span>3 &nbsp; Share</span></div></section></div>`;
}

function renderPortfolio() {
  return `<div class="view-header"><div><div class="eyebrow">LOOK HOW FAR YOU’VE COME</div><h1>My portfolio</h1><p>A home for your experiments, projects, and small victories.</p></div><button class="button-primary" data-action="toast" data-message="Project creation is coming soon. Keep learning!">＋ &nbsp;New project</button></div><div class="portfolio-banner"><div><h2>Your story is taking shape.</h2><p>Complete a learning path and add a project to start building your portfolio.</p></div><button class="button-secondary" data-view="paths">Explore paths →</button></div><div class="section-heading"><h2>Projects</h2><span class="tag">2 projects</span></div><div class="project-grid"><article class="project-card"><div class="project-thumb">hello, world<span style="color:var(--lime)">_</span></div><h3>My first prompt</h3><p>A first experiment in asking better questions.</p><span class="tag in-progress">Prompt engineering</span></article><article class="project-card"><div class="project-thumb" style="background:radial-gradient(circle at 20% 80%,#343f2b 0,transparent 35%),linear-gradient(140deg,#1d2922,#171c16);color:#b4d7b5">version 01 <span style="color:#96dc9d">⑂</span></div><h3>Git practice repo</h3><p>A sandbox for my first commits and branches.</p><span class="tag">Git essentials</span></article></div>`;
}

const renderers = { dashboard: renderDashboard, paths: renderPaths, 'prompt-lab': renderPromptLab, 'git-playground': renderGit, portfolio: renderPortfolio };
function navigate(view) {
  if (!renderers[view]) return;
  activeView = view;
  breadcrumb.textContent = labels[view];
  document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  viewRoot.innerHTML = renderers[view]();
  if (view === 'git-playground') bindTerminal();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showToast(message) {
  const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message;
  toastRegion.append(toast); window.setTimeout(() => toast.remove(), 2800);
}
function openDialog(title, body, actionLabel = 'Got it') {
  dialogContent.innerHTML = `<h2>${title}</h2><p>${body}</p><div class="dialog-actions"><button class="button-primary" data-action="dialog-confirm">${actionLabel} <span>→</span></button><button class="button-quiet" data-action="close-dialog">Close</button></div>`;
  if (!dialog.open) dialog.showModal();
}
function findPath(id) { return pathData.find(path => path.id === id); }
function openPath(id) {
  const path = findPath(id); if (!path) return;
  openDialog(path.title, `${path.subtitle}. This learning path includes ${path.lessons} short lessons and takes about ${path.duration}. Your progress is saved in this demo while you explore.`, path.progress ? 'Continue learning' : 'Start learning');
}
function analyzePrompt() {
  const input = document.querySelector('#prompt-input'); if (!input) return;
  const text = input.value.trim().toLowerCase();
  const checks = [
    ['role', /\b(as|act as|you are|role)\b/.test(text)],
    ['task', /\b(make|create|build|design|plan|write|help|explain)\b/.test(text)],
    ['context', /\b(beginner|for me|because|context|personal|simple|audience)\b/.test(text)],
    ['format', /\b(list|steps|format|table|bullet|outline|numbered)\b/.test(text)]
  ];
  const missing = checks.filter(([, done]) => !done).map(([name]) => name);
  const feedback = document.querySelector('#prompt-feedback');
  if (!text) { feedback.innerHTML = '<strong>Start with your goal</strong>Write a prompt above first, then ask for feedback.'; return; }
  if (missing.length === 0) feedback.innerHTML = '<strong>Nice work — your prompt has a clear shape!</strong>You included a role, task, context, and format. Read it once more and make sure the request sounds like you.';
  else feedback.innerHTML = `<strong>A good start — let’s add a little clarity.</strong>Your prompt could use ${missing.join(' and ')}. Try naming who the AI should act as, describe the website and its audience, and ask for a short numbered plan.`;
  showToast(missing.length ? 'Feedback is ready — your next revision can be even clearer.' : 'Great structure! Your prompt has all four ingredients.');
}
function bindTerminal() {
  const form = document.querySelector('#terminal-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#terminal-input'); const command = input.value.trim(); if (!command) return;
    const output = document.querySelector('#terminal-output'); let response = '<div class="subtle">Try git status, git add ., git commit -m &quot;message&quot;, or git log.</div>';
    if (command === 'git status') response = '<div class="success">On branch main</div><div>Changes not staged for commit: index.html, styles.css</div>';
    else if (command === 'git add .' || command === 'git add index.html' || command === 'git add styles.css') response = '<div class="success">Changes staged for commit.</div>';
    else if (command.startsWith('git commit')) { commitCount += 1; response = '<div class="success">[main e4f5g6h] changes saved to history</div><div>2 files changed, 8 insertions(+)</div>'; }
    else if (command === 'git log') response = '<div class="success">commit a1b2c3d (HEAD -&gt; main)</div><div class="subtle">first commit: project setup</div>';
    commandHistory.push(`<div><span class="prompt-symbol">$</span> ${escapeHtml(command)}</div>${response}`);
    viewRoot.innerHTML = renderGit(); bindTerminal();
    const refreshed = document.querySelector('#terminal-output'); refreshed.scrollTop = refreshed.scrollHeight;
    if (command.startsWith('git commit')) showToast('Commit added to your practice history.');
  });
}
function escapeHtml(text) { const element = document.createElement('span'); element.textContent = text; return element.innerHTML; }

document.addEventListener('click', event => {
  const target = event.target.closest('[data-view], [data-action], [data-filter]'); if (!target) return;
  if (target.dataset.view) { navigate(target.dataset.view); return; }
  if (target.dataset.filter) {
    document.querySelectorAll('[data-filter]').forEach(chip => chip.classList.toggle('active', chip === target));
    document.querySelectorAll('.library-card').forEach(card => { card.hidden = target.dataset.filter !== 'all' && card.dataset.category !== target.dataset.filter; }); return;
  }
  switch (target.dataset.action) {
    case 'open-path': openPath(target.dataset.id); break;
    case 'analyze-prompt': analyzePrompt(); break;
    case 'stage-commit': commitCount += 1; navigate('git-playground'); showToast('Changes staged and committed in your sandbox.'); break;
    case 'open-challenge': if (target.dataset.id === 'prompt') navigate('prompt-lab'); else navigate('git-playground'); break;
    case 'toast': showToast(target.dataset.message || 'You’re all caught up.'); break;
    case 'help': openDialog('Help & resources', 'Expectik is your friendly space to learn AI, prompt engineering, and Git. Explore a path, try a challenge, and experiment at your own pace.'); break;
    case 'profile': openDialog('Your learning profile', 'You’re on a 4-day streak, have completed 12 lessons, and are growing 6 practical skills. Keep going — you’re doing great!'); break;
    case 'notifications': openDialog('You’re all caught up', 'No new notifications right now. Your next learning milestone is just around the corner.'); break;
    case 'close-dialog': dialog.close(); break;
    case 'dialog-confirm': dialog.close(); if (activeView === 'dashboard') navigate('prompt-lab'); else showToast('Let’s keep learning — try the exercise on this page.'); break;
  }
});

document.querySelector('#global-search').addEventListener('input', event => {
  if (activeView !== 'paths') navigate('paths');
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll('.library-card').forEach(card => { card.hidden = query.length > 0 && !card.textContent.toLowerCase().includes(query); });
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('#global-search').focus(); }
  if (event.key === 'Escape' && dialog.open) dialog.close();
});
navigate('dashboard');
