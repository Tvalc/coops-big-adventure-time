window.Game = class Game {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.state = 'menu'; // 'menu', 'playing', 'gameover'
        this.score = 0;

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.startGame = this.startGame.bind(this);
        
        this.showMenu();
    }

    showMenu() {
        this.clearUI();
        this.menuDiv = document.createElement('div');
        this.menuDiv.className = 'menu';
        this.menuDiv.innerHTML = `
            <h2>Color Orbs</h2>
            <p>Move with <b>Arrow Keys</b>.<br>Collect colored orbs, avoid the walls!</p>
            <button id="startBtn">Start Game</button>
        `;
        this.container.appendChild(this.menuDiv);
        document.getElementById('startBtn').onclick = this.startGame;
    }

    showGameOver() {
        this.clearUI();
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>Game Over</h2>
            <p>Your Score: <b>${this.score}</b></p>
            <button id="restartBtn">Restart</button>
        `;
        this.container.appendChild(gameOverDiv);
        document.getElementById('restartBtn').onclick = this.startGame;
    }

    clearUI() {
        if (this.menuDiv) this.menuDiv.remove();
    }

    startGame() {
        this.clearUI();
        this.state = 'playing';
        this.score = 0;
        this.player = new window.Player(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        this.orb = new window.Orb();
        this.render();
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(e) {
        if (this.state !== 'playing') return;
        switch (e.key) {
            case "ArrowUp": this.player.vy = -PLAYER_SPEED; break;
            case "ArrowDown": this.player.vy = PLAYER_SPEED; break;
            case "ArrowLeft": this.player.vx = -PLAYER_SPEED; break;
            case "ArrowRight": this.player.vx = PLAYER_SPEED; break;
        }
    }

    handleKeyUp(e) {
        if (this.state !== 'playing') return;
        if (["ArrowUp", "ArrowDown"].includes(e.key)) this.player.vy = 0;
        if (["ArrowLeft", "ArrowRight"].includes(e.key)) this.player.vx = 0;
    }

    render() {
        if (this.state !== 'playing') return;

        this.player.update();

        // Collision: walls
        if (
            this.player.x - PLAYER_RADIUS < 0 ||
            this.player.x + PLAYER_RADIUS > GAME_WIDTH ||
            this.player.y - PLAYER_RADIUS < 0 ||
            this.player.y + PLAYER_RADIUS > GAME_HEIGHT
        ) {
            this.endGame();
            return;
        }

        // Collision: orb
        if (dist(this.player.x, this.player.y, this.orb.x, this.orb.y) < PLAYER_RADIUS + ORB_RADIUS) {
            this.score++;
            this.player.color = this.orb.color;
            this.orb.spawn();
        }

        // Draw
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.drawOrb();
        this.drawPlayer();
        requestAnimationFrame(this.render.bind(this));
    }

    drawOrb() {
        this.ctx.beginPath();
        this.ctx.arc(this.orb.x, this.orb.y, this.orb.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.orb.color;
        this.ctx.fill();
    }

    drawPlayer() {
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.player.color;
        this.ctx.fill();
    }

    endGame() {
        this.state = 'gameover';
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.showGameOver();
    }
};

// Initialize the game
window.onload = () => {
    new Game('gameContainer');
};