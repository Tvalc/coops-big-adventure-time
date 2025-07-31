window.Enemy = class Enemy {
    constructor(x, y, type = 'normal') {
        const C = type === 'miniBoss' ? window.CONSTANTS.MINI_BOSS : window.CONSTANTS.ENEMY;
        this.x = x;
        this.y = y;
        this.w = C.WIDTH;
        this.h = C.HEIGHT;
        this.type = type;
        this.velX = 0;
        this.velY = 0;
        this.isGrounded = false;
        this.health = C.HEALTH;
        this.maxHealth = C.HEALTH;
        this.attackTimer = 0;
        this.damage = C.DAMAGE;
        this.facing = -1;
        this.dead = false;
        this.attackAnim = 0;
        this.color = C.COLOR;
        this.invincibleTimer = 0;
    }

    update(target, dt, game) {
        const C = this.type === 'miniBoss' ? window.CONSTANTS.MINI_BOSS : window.CONSTANTS.ENEMY;
        if (this.dead) return;
        // Simple AI: move towards player
        let dx = target.x + target.w/2 - (this.x + this.w/2);
        let dist = Math.abs(dx);

        this.facing = dx > 0 ? 1 : -1;

        // Movement
        if (dist > C.ATTACK_RANGE - 8) {
            this.velX = window.Utils.clamp(dx * 0.08, -C.SPEED, C.SPEED);
        } else {
            this.velX = 0;
        }
        this.x += this.velX;

        // Gravity
        this.velY += C.GRAVITY;
        this.y += this.velY;

        // Floor
        if (this.y + this.h >= window.CONSTANTS.FLOOR_Y) {
            this.y = window.CONSTANTS.FLOOR_Y - this.h;
            this.velY = 0;
            this.isGrounded = true;
        }

        // Attack
        if (dist < C.ATTACK_RANGE && this.attackTimer <= 0) {
            this.attackAnim = 1;
            this.attackTimer = C.ATTACK_COOLDOWN;
            if (target.invincibleTimer <= 0) {
                target.takeDamage(this.damage);
            }
        }
        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
            if (this.attackTimer < 120) this.attackAnim = 0;
        }

        // Invincibility flicker
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    }

    takeDamage(dmg) {
        if (this.invincibleTimer > 0 || this.dead) return;
        this.health -= dmg;
        this.invincibleTimer = 140;
        if (this.health <= 0) {
            this.health = 0;
            this.dead = true;
        }
    }

    render(ctx, cameraX) {
        ctx.save();
        ctx.translate(this.x - cameraX, this.y);

        // Shadow
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.ellipse(this.w/2, this.h-6, this.w*0.35, 8, 0, 0, Math.PI*2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Body shape
        ctx.save();
        ctx.translate(this.w/2, 0);
        ctx.scale(this.facing, 1);
        ctx.translate(-this.w/2, 0);

        // Body gradient
        let grad = ctx.createLinearGradient(0, 0, 0, this.h);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, '#471d1d');
        ctx.fillStyle = grad;
        ctx.fillRect(8, 18, this.w-16, this.h-18);

        // Arms
        ctx.fillStyle = '#ffd0c2';
        ctx.fillRect(2, 28, 8, 18);
        ctx.fillRect(this.w-10, 28, 8, 18);

        // Head
        ctx.beginPath();
        ctx.arc(this.w/2, 14, this.type === 'miniBoss' ? 21 : 13, 0, Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = this.type === 'miniBoss' ? '#cf84e3' : '#fff3e0';
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.w/2-7, 18, 5, 7);
        ctx.fillRect(this.w/2+2, 18, 5, 7);

        // Attack animation (swipe)
        if (this.attackAnim > 0) {
            ctx.save();
            ctx.translate(this.facing === 1 ? this.w-4 : 4, 40);
            ctx.rotate((this.facing === 1 ? 1 : -1) * 0.29);
            ctx.globalAlpha = 0.67;
            ctx.fillStyle = this.type === 'miniBoss' ? '#a839b7' : '#ffbfae';
            ctx.beginPath();
            ctx.ellipse(0, 0, 26, 10, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();

        // Invincibility flicker
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer/50)%2 === 0) {
            ctx.globalAlpha = 0.22;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.globalAlpha = 1.0;
        }

        // Health bar (mini-boss/enemy)
        if (!this.dead && (this.type === 'miniBoss' || this.health < this.maxHealth)) {
            let pct = this.health / this.maxHealth;
            ctx.fillStyle = '#222';
            ctx.fillRect(4, 3, this.w-8, 7);
            ctx.fillStyle = this.type === 'miniBoss' ? '#e7b0ff' : '#ff8b7b';
            ctx.fillRect(4, 3, (this.w-8)*pct, 7);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(4, 3, this.w-8, 7);
        }

        ctx.restore();
    }
};