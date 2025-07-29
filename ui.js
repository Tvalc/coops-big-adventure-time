// =============== UI Manager ===============
window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.uiLayer = document.getElementById('ui-layer');
    this.menuOverlay = null;
    this.hud = null;
    this.showMainMenu();
  }

  clear() {
    this.uiLayer.innerHTML = '';
    this.menuOverlay = null;
    this.hud = null;
  }

  showMainMenu() {
    this.clear();
    this.menuOverlay = document.createElement('div');
    this.menuOverlay.className = 'menu-overlay';

    const title = document.createElement('div');
    title.className = 'menu-title';
    title.textContent = 'Coop vs. the FUD Monsters';

    const btnStart = document.createElement('button');
    btnStart.className = 'menu-btn';
    btnStart.textContent = 'Start Game';
    btnStart.onclick = () => this.game.startGame();

    const btnHow = document.createElement('button');
    btnHow.className = 'menu-btn';
    btnHow.textContent = 'How to Play';
    btnHow.onclick = () => this.showHowToPlay();

    this.menuOverlay.appendChild(title);
    this.menuOverlay.appendChild(btnStart);
    this.menuOverlay.appendChild(btnHow);

    this.uiLayer.appendChild(this.menuOverlay);
  }

  showHowToPlay() {
    this.clear();
    this.menuOverlay = document.createElement('div');
    this.menuOverlay.className = 'menu-overlay';
    this.menuOverlay.innerHTML = `
      <div class="menu-title">How to Play</div>
      <ul style="color:#fff; font-size:1.1em; margin-bottom:2em; text-align:left; max-width:500px;">
        <li>Move: <b>←/→</b> or <b>A/D</b></li>
        <li>Jump: <b>↑</b> or <b>W</b> or <b>Space</b></li>
        <li>Attack: <b>J</b> or <b>Z</b></li>
        <li>Defeat all FUD monsters in each wave!</li>
        <li>Progress through scenes and earn upgrades.</li>
      </ul>
      <button class="menu-btn" id="backBtn">Back</button>
    `;
    this.uiLayer.appendChild(this.menuOverlay);
    document.getElementById('backBtn').onclick = () => this.showMainMenu();
  }

  showHUD(playerStats, stageInfo) {
    if (!this.hud) {
      this.hud = document.createElement('div');
      this.hud.className = 'hud-bar';
      this.uiLayer.appendChild(this.hud);
    }
    // Stats
    this.hud.innerHTML = `
      <span class="hud-icon"></span>
      <span class="hud-label">HP:</span>
      <span class="hud-value">${playerStats.hp}/${playerStats.maxHp}</span>
      <span class="hud-label hud-score">Score: ${playerStats.score}</span>
      <span class="hud-label" style="margin-left:14px">Wave:</span>
      <span class="hud-value">${stageInfo.wave}</span>
    `;
  }

  hideHUD() {
    if (this.hud && this.hud.parentNode) this.hud.parentNode.removeChild(this.hud);
    this.hud = null;
  }

  showGameOver(finalScore, restartCallback) {
    this.clear();
    this.menuOverlay = document.createElement('div');
    this.menuOverlay.className = 'menu-overlay';
    this.menuOverlay.innerHTML = `
      <div class="menu-title">Game Over</div>
      <div style="color:#fff;font-size:1.1em;margin-bottom:1em;">
        Score: <b>${finalScore}</b>
      </div>
      <button class="menu-btn" id="restartBtn">Restart</button>
      <button class="menu-btn" id="menuBtn">Main Menu</button>
    `;
    this.uiLayer.appendChild(this.menuOverlay);
    document.getElementById('restartBtn').onclick = restartCallback;
    document.getElementById('menuBtn').onclick = () => this.showMainMenu();
  }
};