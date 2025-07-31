window.Player = class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = PLAYER_RADIUS;
        this.color = randomColor();
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    reset() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.color = randomColor();
    }
};

window.Orb = class Orb {
    constructor() {
        this.spawn();
    }

    spawn() {
        this.x = randInt(ORB_RADIUS + 10, GAME_WIDTH - ORB_RADIUS - 10);
        this.y = randInt(ORB_RADIUS + 10, GAME_HEIGHT - ORB_RADIUS - 10);
        this.radius = ORB_RADIUS;
        this.color = randomColor();
    }
};