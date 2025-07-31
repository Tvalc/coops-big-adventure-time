(function() {
    function initGame() {
        // Setup canvas
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const W = window.CONSTANTS.GAME_WIDTH;
        const H = window.CONSTANTS.GAME_HEIGHT;
        let deviceIsMobile = window.matchMedia("(max-width: 1000px)").matches;

        // Input state
        let input = {
            left: false, right: false, jump: false, attack: false
        };
        let keyMap = {
            37: 'left', 39: 'right', 38: 'jump', 90: 'attack', 32: 'jump', 13: 'start'
        };

        function setupInput() {
            // Keyboard
            window.addEventListener('keydown', function(e) {
                if (e.repeat) return;
                if (game.state === 'start' && (e.keyCode === 13 || e.keyCode === 32)) {
                    game.startGame();
                } else if (game.state === 'gameover' && (e.keyCode === 13 || e.keyCode === 32)) {
                    game.restart();
                }
                let act = keyMap[e.keyCode];
                if (act && game.state === 'playing') {
                    input[act] = true;
                    e.preventDefault();
                }
            });
            window.addEventListener('keyup', function(e) {
                let act = keyMap[e.keyCode];
                if (act) {
                    input[act] = false;
                    e.preventDefault();
                }
            });
            // Touch/mobile
            if (deviceIsMobile) {
                let btnLeft = document.getElementById('btnLeft');
                let btnRight = document.getElementById('btnRight');
                let btnJump = document.getElementById('btnJump');
                let btnAttack = document.getElementById('btnAttack');
                btnLeft.addEventListener('touchstart', e => { input.left = true; });
                btnLeft.addEventListener('touchend', e => { input.left = false; });
                btnRight.addEventListener('touchstart', e => { input.right = true; });
                btnRight.addEventListener('touchend', e => { input.right = false; });
                btnJump.addEventListener('touchstart', e => { input.jump = true; });
                btnJump.addEventListener('touchend', e => { input.jump = false; });
                btnAttack.addEventListener('touchstart', e => { input.attack = true; });
                btnAttack.addEventListener('touchend', e => { input.attack = false; });
                // Start menu via tap anywhere on canvas
                canvas.addEventListener('touchend', function(e) {
                    if (game.state === 'start') game.startGame();
                    else if (game.state === 'gameover') game.restart();
                });
            } else {
                // Mouse for start menu/restart
                canvas.addEventListener('mousedown', function(e) {
                    if (game.state === 'start') game.startGame();
                    else if (game.state === 'gameover') game.restart();
                });
            }
        }

        // Main GameManager
        window.GameManager = class GameManager {
            constructor(ctx, W, H) {
                this.ctx = ctx;
                this.W = W;
                this.H = H;
                this.levelLength = 1800; // px (scrollable area)
                this.reset();
                this.render = this.render.bind(this);
                this.lastTime = performance.now();
                this.accumulator = 0;
                this.render();
            }

            reset() {
                this.state = 'start'; // 'playing', 'gameover'
                this.player = new window.Player(100, window.CONSTANTS.FLOOR_Y - window.CONSTANTS.PLAYER.HEIGHT);
                this.entities = [];
                this.wave = 1;
                this.spawnWave();
                this.score = 0;
                this.cameraX = 0;
                this.waveCleared = false;
                this.waveTimer = 0;
                this.levelLength = 1800;
            }

            startGame() {
                this.reset();
                this.state = 'playing';
            }

            restart() {
                this.startGame();
            }

            spawnWave() {
                this.entities = [];
                let numEnemies = window.CONSTANTS.WAVE.ENEMIES_BASE + (this.wave-1)*window.CONSTANTS.WAVE.ENEMY_INCREASE;
                let y = window.CONSTANTS.FLOOR_Y - window.CONSTANTS.ENEMY.HEIGHT;
                for (let i = 0; i < numEnemies; ++i) {
                    let x = this.levelLength - 120 - i*window.Utils.randomInt(60, 120);
                    this.entities.push(new window.Enemy(x, y, 'normal'));
                }
                if (this.wave === window.CONSTANTS.WAVE.MINI_BOSS_WAVE) {
                    // Add mini boss
                    this.entities.push(new window.Enemy(this.levelLength - 200, window.CONSTANTS.FLOOR_Y - window.CONSTANTS.MINI_BOSS.HEIGHT, 'miniBoss'));
                }
                this.waveCleared = false;
            }

            update(dt) {
                if (this.state !== 'playing') return;

                // Player
                this.player.update(input, dt, this);

                // Enemies
                for (let enemy of this.entities) {
                    enemy.update(this.player, dt, this);
                }

                // Attack collisions
                let hitbox = this.player.getAttackHitbox();
                if (hitbox) {
                    for (let enemy of this.entities) {
                        if (enemy.dead) continue;
                        if (window.Utils.rectsOverlap(hitbox.x, hitbox.y, hitbox.w, hitbox.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
                            enemy.takeDamage(this.player.combo === 3 ? 36 : 18);
                            if (enemy.dead) {
                                this.score += (enemy.type === 'miniBoss' ? window.CONSTANTS.SCORE.MINI_BOSS : window.CONSTANTS.SCORE.ENEMY);
                            }
                        }
                    }
                }

                // Remove dead enemies (with a small death animation time)
                this.entities = this.entities.filter(e => !e.dead || e.invincibleTimer > 0);

                // Check if all enemies dead
                if (!this.waveCleared && this.entities.every(e => e.dead)) {
                    this.waveCleared = true;
                    this.waveTimer = 0;
                }

                if (this.waveCleared) {
                    this.waveTimer += dt;
                    // Advance after 1.2s
                    if (this.waveTimer >= 1200) {
                        this.wave++;
                        if (this.wave > window.CONSTANTS.WAVE.MAX_WAVES) {
                            // Victory condition (for now, cycle to wave 1)
                            this.wave = 1;
                        }
                        this.spawnWave();
                    }
                }

                // Camera follows player
                let margin = window.CONSTANTS.CAMERA.EDGE_MARGIN;
                let camTarget = this.player.x + this.player.w/2 - this.W/2;
                this.cameraX = window.Utils.clamp(camTarget, 0, this.levelLength - this.W);

                // Game over
                if (this.player.dead) {
                    this.state = 'gameover';
                }
            }

            render() {
                // Timing
                let now = performance.now();
                let dt = window.Utils.clamp(now - this.lastTime, 10, 50);
                this.lastTime = now;

                // Update game logic
                this.update(dt);

                // Draw
                this.ctx.clearRect(0, 0, this.W, this.H);
                // Level background
                window.UI.drawLevelBG(this.ctx, this.cameraX, this.levelLength, this.W, this.H);

                // Entities
                for (let enemy of this.entities) {
                    enemy.render(this.ctx, this.cameraX);
                }
                this.player.render(this.ctx, this.cameraX);

                // HUD
                window.UI.drawHUD(this.ctx, this.player, this.wave, this.score, this.W, this.H);

                // Menus
                if (this.state === 'start') {
                    window.UI.drawStartMenu(this.ctx, this.W, this.H);
                } else if (this.state === 'gameover') {
                    window.UI.drawGameOver(this.ctx, this.W, this.H, this.score, this.wave-1);
                }

                window.requestAnimationFrame(this.render);
            }
        };

        // Create game and input
        let game = new window.GameManager(ctx, W, H);
        setupInput();

        // Focus canvas for keyboard control
        setTimeout(() => { canvas.focus(); }, 50);
    }

    window.addEventListener('DOMContentLoaded', initGame);
})();