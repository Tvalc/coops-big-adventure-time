// =============== GameManager ===============
window.GameManager = class GameManager {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.input = new window.InputSystem();
    this.progression = new window.ProgressionSystem();
    this.ui = new window.UIManager(this);

    this.player = null;
    this.enemyManager = null;

    this.state = 'menu'; // menu, playing, gameover
    this.lastTimestamp = 0;

    // For simple scene backgrounds
    this.bgColorIdx = 0;
    this.bgAnimT = 0;

    // === Background image for first scene ===
    this.bgImage = new window.Image();
    this.bgImage.src = 'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/BackGround_1_SS_1753769088005.png';

    // Bindings
    this._boundRender = this.render.bind(this);
  }

  startGame() {
    // Reset all game state
    this.player = new window.Player(120, window.GAME_CONSTANTS.GROUND_Y - window.GAME_CONSTANTS.PLAYER.RADIUS);
    this.enemyManager = new window.EnemyManager();
    this.enemyManager.startWave(3, {});
    this.enemyManager.onWaveEnd = this.onWaveCleared.bind(this);

    this.progression.state.current = { level: 1, stage: 1, scene: 1, wave: 1 };
    this.state = 'playing';
    this.ui.clear();
    this.lastTimestamp = 0;
    window.requestAnimationFrame(this._boundRender);
  }

  onWaveCleared() {
    // Next wave or scene
    let c = this.progression.state.current;
    c.wave++;
    if (c.wave > window.GAME_CONSTANTS.WAVES) {
      c.wave = 1; c.scene++;
      // TODO: stage/level advance, boss, reward
    }
    // TODO: Boss, upgrades, etc
    // For now: spawn more enemies
    let nextN = Math.min(3 + c.wave, 10);
    this.enemyManager.startWave(nextN, {});
  }

  render(ts) {
    if (this.state === 'menu') return; // Not playing

    let dt = (ts - this.lastTimestamp) || 16;
    this.lastTimestamp = ts;

    // Update
    if (this.state === 'playing') {
      this.update(dt);
      this.draw();
    }

    if (this.state === 'playing') window.requestAnimationFrame(this._boundRender);
  }

  update(dt) {
    // Player input
    if (this.input.consumeJump()) this.player.jump();
    if (this.input.consumeAttack()) {
      if (this.player.attack(this.enemyManager.enemies)) {
        // Play hit sound (future)
      }
    }
    // --- Bubble Gun input: consumeShoot() ---
    if (this.input.consumeShoot()) {
      this.player.shoot();
    }

    // Pass both input and world (enemies) to Player
    this.player.update(this.input, dt, { enemies: this.enemyManager.enemies });

    // Enemies & PowerUps
    this.enemyManager.update(this.player, dt);

    // Score/currency for defeated
    let defeated = 0;
    for (let e of this.enemyManager.enemies) {
      if (!e.isAlive && !e._scored) {
        this.player.stats.score += window.GAME_CONSTANTS.SCORE_PER_ENEMY;
        this.player.stats.currency += window.GAME_CONSTANTS.CURRENCY_PER_ENEMY;
        e._scored = true;
        defeated++;
      }
    }

    // Game over
    if (this.player.stats.hp <= 0) {
      this.state = 'gameover';
      this.ui.showGameOver(this.player.stats.score, () => this.startGame());
      return;
    }
  }

  draw() {
    // =================== BACKGROUND ===================
    let c = this.progression.state.current;
    if (
      c.level === 1 &&
      c.stage === 1 &&
      c.scene === 1 &&
      this.bgImage.complete
    ) {
      // Draw custom image background, stretched to canvas
      this.ctx.drawImage(
        this.bgImage,
        0,
        0,
        window.GAME_CONSTANTS.WIDTH,
        window.GAME_CONSTANTS.HEIGHT
      );
    } else {
      // Existing gradient background for all other scenes
      this.bgAnimT += 0.009;
      let bgCols = window.GAME_CONSTANTS.BG_COLORS;
      let idx = this.bgColorIdx;
      let nextIdx = (idx+1)%bgCols.length;
      let grad = this.ctx.createLinearGradient(0,0,0,window.GAME_CONSTANTS.HEIGHT);
      grad.addColorStop(0, bgCols[idx]);
      grad.addColorStop(Math.abs(Math.sin(this.bgAnimT))*0.9, bgCols[nextIdx]);
      grad.addColorStop(1, '#22252e');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, window.GAME_CONSTANTS.WIDTH, window.GAME_CONSTANTS.HEIGHT);
    }

    // Platform ground
    window.Utils.drawRoundedRect(
      this.ctx,
      0, window.GAME_CONSTANTS.GROUND_Y+30,
      window.GAME_CONSTANTS.WIDTH, window.GAME_CONSTANTS.HEIGHT-window.GAME_CONSTANTS.GROUND_Y-30,
      24, '#18223a', '#223'
    );
    this.ctx.save();
    this.ctx.shadowColor = '#0ff2';
    this.ctx.shadowBlur = 24;
    this.ctx.fillStyle = '#2e436e';
    this.ctx.fillRect(0, window.GAME_CONSTANTS.GROUND_Y, window.GAME_CONSTANTS.WIDTH, 36);
    this.ctx.restore();

    // Player (includes projectiles)
    this.player.draw(this.ctx);

    // Enemies & PowerUps
    this.enemyManager.draw(this.ctx);

    // HUD
    this.ui.showHUD(this.player.stats, this.progression.state.current);
  }
};

// ======= Initialization =========

function initGame() {
  try {
    window.gameManager = new window.GameManager();
    // Show menu immediately
    window.gameManager.ui.showMainMenu();
  } catch (e) {
    alert('Game failed to load. See console for details.');
    console.error(e);
  }
}

window.addEventListener('DOMContentLoaded', initGame);