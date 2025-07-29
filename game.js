// =======================
// Coop vs. the FUD Monsters - Modular Architecture Scaffold
// =======================

// --- Types/Interfaces Section ---
window.GameTypes = {
    PlayerStats: function() { return { hp: 100, maxHp: 100, atk: 10, def: 3, speed: 6, jump: 14, abilities: [] }; },
    EnemyConfig: function() { return { type: "basic", hp: 30, atk: 6, speed: 3, color: "#ff5757" }; },
    LevelMeta: function() { return { level: 1, stage: 1, scene: 1, wave: 1 }; },
    ProgressionState: function() { return { unlockedSkills: [], currency: 0, score: 0 }; }
};

// --- Utility Functions ---
window.Utils = {
    clamp: function(val, min, max) { return Math.max(min, Math.min(max, val)); },
    lerp: function(a, b, t) { return a + (b - a) * t; },
    randInt: function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
    gradientFillRect: function(ctx, x, y, w, h, color1, color2, vertical) {
        let grad = vertical
            ? ctx.createLinearGradient(x, y, x, y + h)
            : ctx.createLinearGradient(x, y, x + w, y);
        grad.addColorStop(0, color1); grad.addColorStop(1, color2);
        ctx.fillStyle = grad; ctx.fillRect(x, y, w, h);
    }
};

// --- Progression System ---
window.Progression = class Progression {
    constructor() {
        this.meta = window.GameTypes.LevelMeta();
        this.state = window.GameTypes.ProgressionState();
    }
    nextWave() {
        this.meta.wave++;
        // TODO: Check for wave/scene/stage/level transitions
    }
    addScore(amount) { this.state.score += amount; }
    addCurrency(amount) { this.state.currency += amount; }
    unlockSkill(skill) { if (!this.state.unlockedSkills.includes(skill)) this.state.unlockedSkills.push(skill); }
};

// --- Enemy System ---
window.Enemy = class Enemy {
    constructor(config, x, y) {
        config = config || window.GameTypes.EnemyConfig();
        this.type = config.type;
        this.hp = config.hp;
        this.maxHp = config.hp;
        this.atk = config.atk;
        this.speed = config.speed;
        this.color = config.color || "#ff5757";
        this.x = x || 0;
        this.y = y || 0;
        this.width = 38; this.height = 44;
        this.dx = -this.speed;
        this.isAlive = true;
        // TODO: Add more properties for enemy behavior, AI patterns
    }
    update(dt, player) {
        if (!this.isAlive) return;
        this.x += this.dx * dt;
        // TODO: Add enemy AI, chase/attack logic
        if (this.x + this.width < 0) this.isAlive = false;
    }
    hit(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) { this.hp = 0; this.isAlive = false; }
    }
    render(ctx) {
        // Draw a rounded rectangle enemy with a gradient
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x + this.width - 10, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + 10);
        ctx.lineTo(this.x + this.width, this.y + this.height - 10);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - 10, this.y + this.height);
        ctx.lineTo(this.x + 10, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - 10);
        ctx.lineTo(this.x, this.y + 10);
        ctx.quadraticCurveTo(this.x, this.y, this.x + 10, this.y);
        ctx.closePath();
        let grad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, "#3d3e4e");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#ff8484";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Eyes
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x + 13, this.y + 19, 4, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 13, this.y + 19, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(this.x + 13, this.y + 19, 2, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 13, this.y + 19, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
};

// --- Enemy Spawn Manager ---
window.EnemyManager = class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.spawnTimer = 0;
        this.waveActive = false;
        this.waveConfig = { count: 3, type: "basic", hp: 30, atk: 6, speed: 3 };
    }
    startWave(waveConfig) {
        this.waveConfig = waveConfig || this.waveConfig;
        this.enemies = [];
        this.waveActive = true;
        this.spawnTimer = 0;
        // TODO: Support multiple enemy types and spawn patterns
    }
    update(dt, player) {
        if (!this.waveActive) return;
        if (this.enemies.length < this.waveConfig.count) {
            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0) {
                let y = 280 + window.Utils.randInt(-60, 60);
                let enemy = new window.Enemy(this.waveConfig, 850, y);
                this.enemies.push(enemy);
                this.spawnTimer = 0.9 + Math.random() * 0.5;
            }
        }
        for (let enemy of this.enemies) enemy.update(dt, player);
        // Remove dead/out-of-screen enemies
        this.enemies = this.enemies.filter(e => e.isAlive && e.x + e.width > 0);
    }
    render(ctx) {
        for (let enemy of this.enemies) enemy.render(ctx);
    }
    isWaveCleared() {
        return this.enemies.every(e => !e.isAlive);
    }
};

// --- Player Character ---
window.Player = class Player {
    constructor(x, y) {
        let stats = window.GameTypes.PlayerStats();
        this.x = x || 80;
        this.y = y || 330;
        this.vx = 0;
        this.vy = 0;
        this.width = 50;
        this.height = 56;
        this.grounded = true;
        this.hp = stats.hp;
        this.maxHp = stats.maxHp;
        this.atk = stats.atk;
        this.def = stats.def;
        this.speed = stats.speed;
        this.jumpPower = stats.jump;
        this.abilities = stats.abilities.slice();
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.isHit = false;
        this.hitTimer = 0;
    }
    move(dir) { this.vx = dir * this.speed; }
    jump() {
        if (this.grounded) { this.vy = -this.jumpPower; this.grounded = false; }
    }
    attack() {
        if (this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackCooldown = 0.5;
            // TODO: Trigger attack animation/effects
        }
    }
    hit(dmg) {
        this.hp = window.Utils.clamp(this.hp - dmg, 0, this.maxHp);
        this.isHit = true;
        this.hitTimer = 0.22;
        // TODO: Knockback, invuln, etc.
    }
    update(dt, input) {
        // --- Move ---
        if (input.left) this.move(-1);
        else if (input.right) this.move(1);
        else this.move(0);

        // --- Jump ---
        if (input.jump) this.jump();

        // --- Apply physics ---
        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;

        // Gravity & ground
        this.vy += 0.9 * 48 * dt;
        if (this.y >= 330) {
            this.y = 330;
            this.vy = 0;
            this.grounded = true;
        }

        // Boundaries
        this.x = window.Utils.clamp(this.x, 0, 900 - this.width);

        // --- Attack cooldown ---
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
            if (this.attackCooldown <= 0) this.isAttacking = false;
        }

        // --- Hit flash ---
        if (this.isHit) {
            this.hitTimer -= dt;
            if (this.hitTimer <= 0) this.isHit = false;
        }
    }
    render(ctx) {
        // Player is rendered with a CSS div for the core body.
        // Draw shadow under player
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + this.height - 4, 22, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Optionally: Add procedural effects, e.g. attack swing arcs, power-up glows
        if (this.isAttacking) {
            ctx.save();
            ctx.strokeStyle = "#ffe25a";
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.62;
            ctx.beginPath();
            ctx.arc(this.x + 25, this.y + 28, 38, -0.4, 0.4, false);
            ctx.stroke();
            ctx.restore();
        }
    }
};

// --- Input System ---
window.Input = class Input {
    constructor() {
        this.left = false; this.right = false; this.jump = false; this.attack = false;
        // Touch support
        this.touchLeft = false; this.touchRight = false; this.touchJump = false;
        this._setupListeners();
    }
    _setupListeners() {
        window.addEventListener('keydown', e => {
            if (["ArrowLeft", "a", "A"].includes(e.key)) this.left = true;
            if (["ArrowRight", "d", "D"].includes(e.key)) this.right = true;
            if ([" ", "ArrowUp", "w", "W"].includes(e.key)) this.jump = true;
            if (["j", "J", "z", "Z"].includes(e.key)) this.attack = true;
        });
        window.addEventListener('keyup', e => {
            if (["ArrowLeft", "a", "A"].includes(e.key)) this.left = false;
            if (["ArrowRight", "d", "D"].includes(e.key)) this.right = false;
            if ([" ", "ArrowUp", "w", "W"].includes(e.key)) this.jump = false;
            if (["j", "J", "z", "Z"].includes(e.key)) this.attack = false;
        });
        // Touch support (simple L/R/jump buttons overlay)
        // TODO: Implement on-screen touch controls for mobile
    }
    consumeAttack() {
        let atk = this.attack;
        this.attack = false;
        return atk;
    }
};

// --- Scene System ---
window.GameScene = class GameScene {
    constructor(manager, ctx, width, height) {
        this.manager = manager;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.bgTimer = 0;
        this.bgPattern = null;
        this.player = new window.Player(80, 330);
        this.enemyManager = new window.EnemyManager(this);
        this.input = new window.Input();
        this.waveActive = false;
        this.lastTimestamp = null;
        // TODO: Add support for per-scene/level backgrounds, hazards, pickups
    }
    start() {
        this.enemyManager.startWave({ count: 3, type: "basic", hp: 30, atk: 6, speed: 3 });
        this.waveActive = true;
    }
    update(dt) {
        this.player.update(dt, this.input);
        if (this.input.consumeAttack()) this.player.attack();
        this.enemyManager.update(dt, this.player);

        // Simple collision: check attack hitbox
        if (this.player.isAttacking) {
            for (let enemy of this.enemyManager.enemies) {
                if (enemy.isAlive && this._playerHitsEnemy(enemy)) {
                    enemy.hit(this.player.atk);
                    if (!enemy.isAlive) this.manager.progression.addScore(100);
                }
            }
        }
        // Enemy contact: player takes damage
        for (let enemy of this.enemyManager.enemies) {
            if (enemy.isAlive && this._enemyHitsPlayer(enemy)) {
                this.player.hit(enemy.atk);
            }
        }

        // TODO: Scene transitions, wave logic
        if (this.enemyManager.isWaveCleared() && this.waveActive) {
            this.waveActive = false;
            setTimeout(() => this.onWaveCleared(), 1000);
        }
    }
    onWaveCleared() {
        this.manager.progression.nextWave();
        // TODO: Check progression for next scene/level
        this.enemyManager.startWave({ count: 3 + window.Utils.randInt(0,1), type: "basic", hp: 36, atk: 7, speed: 3.2 });
        this.waveActive = true;
    }
    render() {
        // --- Background ---
        this._drawBackground();
        // --- Player/Enemies ---
        this.player.render(this.ctx);
        this.enemyManager.render(this.ctx);
    }
    _drawBackground() {
        let ctx = this.ctx;
        ctx.save();
        // Parallax gradient + simple procedural pattern
        let grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, "#23243a");
        grad.addColorStop(1, "#282c4a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Distant mountains/procedural shapes
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = "#7187c7";
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            let yBase = 340 + i * 24;
            ctx.moveTo(0, yBase);
            for (let x = 0; x <= this.width; x += 32) {
                let y = yBase - Math.sin((x / 120) + i) * (18 + i * 7);
                ctx.lineTo(x, y);
            }
            ctx.lineTo(this.width, this.height);
            ctx.lineTo(0, this.height);
            ctx.closePath();
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    _playerHitsEnemy(enemy) {
        // Simple frontal arc hitbox
        let px = this.player.x + this.player.width / 2;
        let py = this.player.y + this.player.height / 2;
        let ex = enemy.x + enemy.width / 2;
        let ey = enemy.y + enemy.height / 2;
        let dx = ex - px, dy = ey - py;
        let dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 60 && Math.abs(dx) < 54 && this.player.isAttacking;
    }
    _enemyHitsPlayer(enemy) {
        let px = this.player.x, py = this.player.y, pw = this.player.width, ph = this.player.height;
        let ex = enemy.x, ey = enemy.y, ew = enemy.width, eh = enemy.height;
        return !(px + pw < ex || px > ex + ew || py + ph < ey || py > ey + eh);
    }
};

// --- Game Manager (Core Game Loop, Scene Handling, UI) ---
window.GameManager = class GameManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = 900;
        this.height = 540;
        this.progression = new window.Progression();
        this.running = false;
        this.lastTimestamp = 0;
        this._setupCanvas();
        this._setupUi();
        this._showMenu();
    }
    _setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.display = "block";
        this.canvas.style.background = "transparent";
        this.canvas.style.position = "relative";
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }
    _setupUi() {
        // --- HUD Overlay ---
        this.hud = document.createElement('div');
        this.hud.className = 'hud-overlay';
        this.hud.innerHTML = this._getHudHtml(window.GameTypes.PlayerStats(), this.progression.state);
        this.container.appendChild(this.hud);
    }
    _getHudHtml(playerStats, progState) {
        // HP Bar, Score, Currency, Wave
        return `
        <span class="hud-block">
            <span class="hud-label">HP</span>
            <span class="hud-hp-bar"><span class="hud-hp-fill" style="width:${playerStats.hp / playerStats.maxHp * 100}%"></span></span>
            <span class="hud-label hud-currency"><svg width="15" height="13" style="vertical-align:-2px;" viewBox="0 0 15 13"><ellipse cx="7.5" cy="7" rx="7.5" ry="5.8" fill="#ffe25a"/></svg> ${progState.currency}</span>
        </span>
        <span class="hud-block">
            <span class="hud-label">Score</span>
            <span class="hud-score">${progState.score}</span>
        </span>
        <span class="hud-block">
            <span class="hud-label">Wave</span>
            <span>${this.progression.meta.level}-${this.progression.meta.stage}-${this.progression.meta.scene}-${this.progression.meta.wave}</span>
        </span>`;
    }
    _updateHud(player, progState) {
        // Update the HUD overlay to reflect current stats
        let hpRatio = player.hp / player.maxHp;
        let fills = this.hud.querySelectorAll('.hud-hp-fill');
        for (let el of fills) { el.style.width = (hpRatio * 100) + "%"; }
        let cur = this.hud.querySelector('.hud-currency');
        if (cur) cur.innerHTML = `<svg width="15" height="13" style="vertical-align:-2px;" viewBox="0 0 15 13"><ellipse cx="7.5" cy="7" rx="7.5" ry="5.8" fill="#ffe25a"/></svg> ${progState.currency}`;
        let score = this.hud.querySelector('.hud-score');
        if (score) score.textContent = progState.score;
        let wave = this.hud.querySelector('.hud-block:last-child span:last-child');
        if (wave) wave.textContent = `${this.progression.meta.level}-${this.progression.meta.stage}-${this.progression.meta.scene}-${this.progression.meta.wave}`;
    }
    _showMenu() {
        this.menu = document.createElement('div');
        this.menu.className = "menu-screen";
        this.menu.innerHTML = `
            <div class="menu-title">Coop vs. the FUD Monsters</div>
            <button class="menu-btn" id="startBtn">Start Game</button>
            <button class="menu-btn" id="howToBtn">How To Play</button>
            <button class="menu-btn" id="quitBtn">Quit</button>
        `;
        this.container.appendChild(this.menu);
        document.getElementById('startBtn').onclick = () => this._startGame();
        document.getElementById('howToBtn').onclick = () => alert(
`Move: Arrow keys / WASD
Jump: Space / W / Up Arrow
Attack: J / Z
Defeat all FUD monsters to clear each wave!
Progress through scenes, stages, and levels.
Upgrade Coop as you play.`
        );
        document.getElementById('quitBtn').onclick = () => {
            window.location.reload();
        };
    }
    _removeMenu() {
        if (this.menu) { this.menu.remove(); this.menu = null; }
    }
    _showCoopPlayerDiv() {
        // Pure CSS player body overlay for Coop
        if (!this.playerDiv) {
            this.playerDiv = document.createElement('div');
            this.playerDiv.className = "coop-player";
            this.container.appendChild(this.playerDiv);
        }
    }
    _updateCoopPlayerDiv(player) {
        if (!this.playerDiv) return;
        this.playerDiv.style.left = (player.x | 0) + "px";
        this.playerDiv.style.top = (player.y | 0) + "px";
        this.playerDiv.className = "coop-player" +
            (player.vy < -0.5 ? " jump" : "") +
            (player.isHit ? " hit" : "");
    }
    _hideCoopPlayerDiv() { if (this.playerDiv) this.playerDiv.style.display = "none"; }
    _startGame() {
        this._removeMenu();
        this._showCoopPlayerDiv();
        this.running = true;
        this.scene = new window.GameScene(this, this.ctx, this.width, this.height);
        this.scene.start();
        this.lastTimestamp = performance.now();
        this._gameLoop(this.lastTimestamp);
    }
    _gameLoop(now) {
        if (!this.running) return;
        let dt = Math.min(0.045, (now - this.lastTimestamp) / 1000.0);
        this.lastTimestamp = now;
        this.scene.update(dt);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.scene.render();
        this._updateHud(this.scene.player, this.progression.state);
        this._updateCoopPlayerDiv(this.scene.player);

        // Check for game over
        if (this.scene.player.hp <= 0) {
            this._gameOver();
            return;
        }
        window.requestAnimationFrame(ts => this._gameLoop(ts));
    }
    _gameOver() {
        this.running = false;
        this._hideCoopPlayerDiv();
        setTimeout(() => {
            this._showMenu();
            alert("Game Over! Coop was overwhelmed by the FUD. Try again!");
        }, 800);
    }
};

// --- Initialization ---
function initGame() {
    if (!document.getElementById('gameContainer')) return;
    window.gameManager = new window.GameManager('gameContainer');
}
// Ensure game initializes as soon as DOM is ready
window.addEventListener('DOMContentLoaded', initGame);

/*
================ README (Developer Guide) ================
How to add new scenes/levels/enemies/abilities:
---------------------------------------------------------
- Levels/scenes/waves: Use the Progression object (meta) to track level/stage/scene/wave. Extend GameScene with new backgrounds/enemy patterns.
- Enemies: Extend window.Enemy for new types. Pass new configs to EnemyManager.startWave().
- Player upgrades: Add to Player.abilities and implement in Player.update()/attack().
- UI/HUD: Update window.GameManager._getHudHtml and _updateHud for new stats/power-ups.
- To expand features: Add new systems as window.SomeSystem = class {...} and instantiate in GameManager/GameScene.
- All graphics are procedural (Canvas/CSS), no assets needed.

TODOs in code are marked for future implementation.
==========================================================
*/