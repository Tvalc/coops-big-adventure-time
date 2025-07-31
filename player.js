window.Player = class Player {
    constructor(x, y) {
        const C = window.CONSTANTS.PLAYER;
        this.x = x;
        this.y = y;
        this.w = C.WIDTH;
        this.h = C.HEIGHT;
        this.velX = 0;
        this.velY = 0;
        this.facing = 1; // 1: right, -1: left
        this.isGrounded = false;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackStep = 0;
        this.attackQueued = false;
        this.health = C.MAX_HEALTH;
        this.invincibleTimer = 0;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.dead = false;
    }

    update(input, dt, game) {
        const C = window.CONSTANTS.PLAYER;
        if (this.dead) return;

        // Move
        let moving = false;
        if (input.left) {
            this.velX = -C.SPEED;
            this.facing = -1;
            moving = true;
        }
        if (input.right) {
            this.velX = C.SPEED;
            this.facing = 1;
            moving = true;
        }
        if (!input.left && !input.right) {
            this.velX = 0;
        }

        // Jump
        if (input.jump && this.isGrounded) {
            this.velY = C.JUMP_VELOCITY;
            this.isGrounded = false;
        }

        // Gravity
        this.velY += C.GRAVITY;
        this.y += this.velY;
        this.x += this.velX;

        // Clamp to floor
        if (this.y + this.h >= window.CONSTANTS.FLOOR_Y) {
            this.y = window.CONSTANTS.FLOOR_Y - this.h;
            this.velY = 0;
            this.isGrounded = true;
        }

        // Attack
        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
            // If attack queued, next combo
            if (this.attackTimer <= C.ATTACK_COOLDOWN * 0.25 && this.attackQueued && this.combo < C.COMBO_LENGTH) {
                this.attackStep++;
                this.combo++;
                this.attackTimer = C.ATTACK_COOLDOWN;
                this.attackQueued = false;
            }
        } else {
            this.isAttacking = false;
            this.combo = 0;
            this.attackStep = 0;
        }
        // Combo timer
        if (this.comboTimer > 0) this.comboTimer -= dt;
        else this.combo = 0;

        // Invincibility
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;

        // Attack key
        if (input.attack) {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.attackTimer = C.ATTACK_COOLDOWN;
                this.attackStep = 1;
                this.combo = 1;
                this.comboTimer = 500;
            } else if (this.combo < C.COMBO_LENGTH) {
                this.attackQueued = true;
                this.comboTimer = 500;
            }
        }
        // Clamp position horizontally
        this.x = window.Utils.clamp(this.x, 0, game.levelLength - this.w);
    }

    getAttackHitbox() {
        // Returns {x, y, w, h} of attack area
        const C = window.CONSTANTS.PLAYER;
        if (!this.isAttacking || this.attackTimer > C.ATTACK_COOLDOWN * 0.8) return null;
        // Short window for actual hit
        return {
            x: this.x + (this.facing === 1 ? this.w : -C.ATTACK_RANGE),
            y: this.y + 18,
            w: C.ATTACK_RANGE,
            h: this.h - 36
        };
    }

    takeDamage(dmg) {
        const C = window.CONSTANTS.PLAYER;
        if (this.invincibleTimer > 0 || this.dead) return;
        this.health -= dmg;
        this.invincibleTimer = C.INVINCIBILITY;
        if (this.health <= 0) {
            this.health = 0;
            this.dead = true;
        }
    }

    heal(amount) {
        this.health = window.Utils.clamp(this.health + amount, 0, window.CONSTANTS.PLAYER.MAX_HEALTH);
    }

    render(ctx, cameraX) {
        // Procedural pixel art: Coop (blue/white)
        ctx.save();
        ctx.translate(this.x - cameraX, this.y);
        // Shadow
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.ellipse(this.w/2, this.h-6, this.w*0.38, 9, 0, 0, Math.PI*2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Body
        ctx.save();
        ctx.translate(this.w/2, 0);
        ctx.scale(this.facing, 1);
        ctx.translate(-this.w/2, 0);

        // Torso
        ctx.fillStyle = 'rgba(64, 108, 247, 0.98)';
        ctx.fillRect(10, 20, 24, 38);

        // Legs
        ctx.fillStyle = '#406cc7';
        ctx.fillRect(12, 58, 7, 14);
        ctx.fillRect(25, 58, 7, 14);

        // Shoes
        ctx.fillStyle = '#fff';
        ctx.fillRect(12, 71, 7, 6);
        ctx.fillRect(25, 71, 7, 6);

        // Arms
        ctx.fillStyle = '#d6eaff';
        ctx.fillRect(4, 24, 8, 18);
        ctx.fillRect(32, 24, 8, 18);

        // Head
        let headGradient = ctx.createRadialGradient(22, 14, 7, 22, 20, 23);
        headGradient.addColorStop(0, '#fff');
        headGradient.addColorStop(1, '#a6c7ff');
        ctx.beginPath();
        ctx.arc(22, 15, 13, 0, Math.PI*2);
        ctx.fillStyle = headGradient;
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#222';
        ctx.fillRect(16, 18, 4, 6);
        ctx.fillRect(27, 18, 4, 6);

        // Attack effect
        if (this.isAttacking && this.attackTimer < 130) {
            ctx.save();
            ctx.translate(this.facing === 1 ? 38 : 2, 36);
            ctx.rotate((this.facing === 1 ? 1 : -1) * 0.22 * (this.attackStep + 1));
            ctx.globalAlpha = 0.78;
            ctx.fillStyle = this.combo === 3 ? '#ffe26a' : '#afd7ff';
            ctx.beginPath();
            ctx.ellipse(0, 0, 38, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();

        // Invincibility flicker
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer/70)%2 === 0) {
            ctx.globalAlpha = 0.32;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.globalAlpha = 1.0;
        }

        ctx.restore();
    }
};