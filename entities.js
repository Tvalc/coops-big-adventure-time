// =================== Coop Sprite Animation Helper ===================
const COOP_ANIMATION_CONFIG = {
  FRAME_WIDTH: 32,
  FRAME_HEIGHT: 48,
  WALK_FRAME_COUNT: 5,
  WALK_FRAME_DURATION: 140, // ms per frame: SNES pacing ~0.12-0.16s
  IMAGE_URLS: [
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_1_1753755399811.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_2_1753755415493.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_3_1753755438859.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_4_1753755459773.png",
    "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_5_1753755468791.png"
  ]
};

/**
 * Preloads an array of images and invokes callback when all loaded.
 * Returns: Array of loaded Image objects (order preserved).
 */
function preloadImages(urls, cb) {
  let loaded = 0;
  const images = [];
  for (let i = 0; i < urls.length; ++i) {
    const img = new window.Image();
    img.src = urls[i];
    img.onload = () => {
      loaded++;
      if (loaded === urls.length && typeof cb === "function") cb(images);
    };
    images[i] = img;
  }
  return images;
}

// =================== BubbleProjectile Class ===================
// ... (no changes required here, omitted for brevity) ...

// =================== Player Class ===================
window.Player = class Player {
  constructor(x, y) {
    const conf = window.GAME_CONSTANTS.PLAYER;
    this.x = x;
    this.y = y;
    // Double the radius for collision logic as we are doubling sprite size
    this.radius = conf.RADIUS * 2;
    this.color = conf.COLOR;
    this.isGrounded = false;
    this.attackCooldown = 0;
    this.facing = 1; // 1: right, -1: left
    /** @type {PlayerStats} */
    this.stats = {
      hp: conf.HP, maxHp: conf.HP,
      attack: 14, defense: 4,
      speed: conf.MOVE_SPEED, jump: conf.JUMP_VELOCITY,
      currency: 0, score: 0
    };
    // Power-up system
    this.activePowerUps = [];
    this.powerUpTimers = {};
    // Animation setup
    this._initAnimationSystem();

    // --- Bubble Gun Mechanic ---
    /** @type {Array<BubbleProjectile>} */
    this.projectiles = [];
    /** @type {number} */
    this.shootCooldown = 0;
  }

  _initAnimationSystem() {
    // Future extensible: can add more actions, directions etc.
    this.animations = {
      idle: { frames: [], duration: 400, loop: true },
      walk_left: { frames: [], duration: COOP_ANIMATION_CONFIG.WALK_FRAME_DURATION, loop: true },
      walk_right: { frames: [], duration: COOP_ANIMATION_CONFIG.WALK_FRAME_DURATION, loop: true }
      // e.g. jump, attack: to add later
    };
    this.animState = "idle";
    this.animTime = 0; // ms
    this.animFrameIdx = 0;

    // Preload images
    this._coopImages = preloadImages(COOP_ANIMATION_CONFIG.IMAGE_URLS, (imgs) => {
      // On load, assign frames for walk_left/right, idle
      this.animations.walk_left.frames = imgs;
      this.animations.idle.frames = [imgs[0]];
      this.animations.walk_right.frames = imgs; // We'll mirror at draw time
      // Optionally, can trigger re-render if needed
    });
  }

  move(dir) {
    this.vx = dir * this.stats.speed;
    if (dir !== 0) this.facing = dir;
  }

  jump() {
    if (this.isGrounded) {
      this.vy = -this.stats.jump;
      this.isGrounded = false;
    }
  }

  attack(enemies) {
    if (this.attackCooldown > 0) return;
    // Simple attack: damage all enemies in attack arc
    let hit = false;
    for (let e of enemies) {
      const dx = e.x - this.x, dy = e.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);
      // Facing angle unused, but in the future can be used for attack arc
      if (
        dist <= window.GAME_CONSTANTS.PLAYER.ATTACK_RADIUS * 2 + e.size/2 &&
        Math.abs(window.Utils.lerp(-Math.PI/2, Math.PI/2, (this.facing+1)/2) - angle) < window.GAME_CONSTANTS.PLAYER.ATTACK_ARC/2
      ) {
        e.takeDamage(this.stats.attack);
        hit = true;
      }
    }
    this.attackCooldown = window.GAME_CONSTANTS.PLAYER.ATTACK_COOLDOWN;
    return hit;
  }

  /**
   * Player's ranged bubble gun attack (shoot). Spawns a BubbleProjectile if not on cooldown.
   */
  shoot() {
    if (this.shootCooldown > 0) return false;
    // Bubble spawns from near player's front
    const spawnX = this.x + this.facing * (this.radius + 8);
    const spawnY = this.y - 10;
    const projectile = new window.BubbleProjectile(spawnX, spawnY, this.facing);
    this.projectiles.push(projectile);
    this.shootCooldown = window.GAME_CONSTANTS.PLAYER.SHOOT_COOLDOWN;
    return true;
  }

  takeDamage(dmg) {
    if (this.hasPowerUp('invincible')) return;
    this.stats.hp -= dmg;
    if (this.stats.hp < 0) this.stats.hp = 0;
  }

  hasPowerUp(type) {
    return this.activePowerUps.includes(type);
  }

  addPowerUp(type, duration) {
    if (!this.activePowerUps.includes(type)) {
      this.activePowerUps.push(type);
    }
    this.powerUpTimers[type] = duration;
    if (type === "heal") {
      let healAmount = Math.floor(this.stats.maxHp * 0.35);
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + healAmount);
      this.removePowerUp("heal");
    }
  }

  removePowerUp(type) {
    let idx = this.activePowerUps.indexOf(type);
    if (idx !== -1) this.activePowerUps.splice(idx, 1);
    delete this.powerUpTimers[type];
    if (type === "attackUp") this.stats.attack -= 8;
    if (type === "speedUp") this.stats.speed -= 2.5;
  }

  applyPowerUps(dt) {
    for (let type of [...this.activePowerUps]) {
      if (type === "attackUp" && !this.stats._attackBoosted) {
        this.stats.attack += 8;
        this.stats._attackBoosted = true;
      }
      if (type === "speedUp" && !this.stats._speedBoosted) {
        this.stats.speed += 2.5;
        this.stats._speedBoosted = true;
      }
      if (this.powerUpTimers[type] != null) {
        this.powerUpTimers[type] -= dt;
        if (this.powerUpTimers[type] <= 0) {
          this.removePowerUp(type);
          if (type === "attackUp") delete this.stats._attackBoosted;
          if (type === "speedUp") delete this.stats._speedBoosted;
        }
      }
    }
  }

  /**
   * Update player physics, powerups, and projectiles.
   * @param {InputSystem} input
   * @param {number} dt
   * @param {Object} world
   */
  update(input, dt, world) {
    this.applyPowerUps(dt);

    // Horizontal movement
    if (input.left) this.move(-1);
    else if (input.right) this.move(1);
    else this.move(0);

    // Animation state selection (future extensible)
    if (input.left) this._setAnimState("walk_left");
    else if (input.right) this._setAnimState("walk_right");
    else this._setAnimState("idle");

    // Animation update
    this._updateAnimation(dt);

    // Physics
    this.x += this.vx;
    this.vy += window.GAME_CONSTANTS.GRAVITY;
    this.y += this.vy;

    // Ground collision using spriteFeetOffset for accurate sprite feet alignment
    const spriteFeetOffset = 4 * 2; // double the feet offset for double size!
    if (this.y + spriteFeetOffset >= window.GAME_CONSTANTS.GROUND_Y) {
      this.y = window.GAME_CONSTANTS.GROUND_Y - spriteFeetOffset;
      this.vy = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
    this.x = window.Utils.clamp(this.x, this.radius, window.GAME_CONSTANTS.WIDTH - this.radius);

    // Attack timer
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.attackCooldown < 0) this.attackCooldown = 0;

    // --- Bubble Gun projectile update ---
    // Update all active projectiles and remove destroyed/off-screen
    if (this.projectiles && Array.isArray(this.projectiles)) {
      for (let i = this.projectiles.length - 1; i >= 0; --i) {
        let proj = this.projectiles[i];
        proj.update(world && world.enemies ? world.enemies : [], dt);
        if (proj.isDestroyed) this.projectiles.splice(i, 1);
      }
    }
    // Shoot cooldown
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.shootCooldown < 0) this.shootCooldown = 0;
  }

  _setAnimState(state) {
    if (this.animState !== state) {
      this.animState = state;
      this.animTime = 0;
      this.animFrameIdx = 0;
    }
  }

  _updateAnimation(dt) {
    const anim = this.animations[this.animState];
    if (!anim || anim.frames.length === 0) return;
    this.animTime += dt;
    const totalFrames = anim.frames.length;
    const frameDuration = anim.duration;
    if (anim.loop) {
      this.animFrameIdx = Math.floor(this.animTime / frameDuration) % totalFrames;
    } else {
      if (this.animTime / frameDuration >= totalFrames) {
        this.animFrameIdx = totalFrames - 1;
      } else {
        this.animFrameIdx = Math.floor(this.animTime / frameDuration);
      }
    }
  }

  /**
   * Draws the player and all active projectiles.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    // If Coop sprites loaded, use them. Otherwise fallback to orb.
    let spriteDrawn = false;
    const anim = this.animations[this.animState];
    if (anim && anim.frames.length > 0) {
      const img = anim.frames[this.animFrameIdx % anim.frames.length];
      if (img && img.complete) {
        ctx.save();
        // Placement: center bottom at (this.x, this.y+4*2)
        const w = COOP_ANIMATION_CONFIG.FRAME_WIDTH;
        const h = COOP_ANIMATION_CONFIG.FRAME_HEIGHT;
        const cx = this.x;
        const cy = this.y + 4 * 2; // double size means double feet offset
        ctx.translate(cx, cy);
        // Double the scale
        ctx.scale(2, 2);
        // Flip horizontally for walk_right
        if (
          (this.animState === "walk_right" || (this.animState === "idle" && this.facing === 1))
        ) {
          ctx.scale(-1, 1);
        }
        ctx.drawImage(img, -w / 2, -h, w, h);
        ctx.restore();
        spriteDrawn = true;
      }
    }
    if (!spriteDrawn) {
      // Fallback to orb (legacy) - double size
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, window.GAME_CONSTANTS.PLAYER.RADIUS * 2, 0, Math.PI*2);
      let grad = ctx.createRadialGradient(this.x, this.y, window.GAME_CONSTANTS.PLAYER.RADIUS*1.2, this.x, this.y, window.GAME_CONSTANTS.PLAYER.RADIUS*2);
      grad.addColorStop(0, '#bbf7ff');
      grad.addColorStop(0.5, this.color);
      grad.addColorStop(1, '#1861a0');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#0ff';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(this.x+this.facing*20, this.y-16, 14, 22, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
    // Powerup visual indicator overlays (unchanged, adjust for new radius)
    if (this.hasPowerUp('invincible')) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius+8, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
    if (this.hasPowerUp('attackUp')) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "#f22";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius+15, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
    if (this.hasPowerUp('speedUp')) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = "#3ff";
      ctx.setLineDash([6, 7]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius+22, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // --- Draw all active bubble projectiles (bubble gun) ---
    if (this.projectiles && Array.isArray(this.projectiles)) {
      for (let proj of this.projectiles) {
        proj.draw(ctx);
      }
    }
  }
};

// =================== PowerUp Entity ===================
// ... (no changes required here, omitted for brevity) ...

// =================== Enemy Class ===================
// ... (no changes required here, omitted for brevity) ...

// =================== PowerUp Manager ===================
// ... (no changes required here, omitted for brevity) ...

// =================== Enemy Spawn Manager ===================
// ... (no changes required here, omitted for brevity) ...

// =================== EnemyManager (spawn & update enemies per wave) ===================
window.EnemyManager = class EnemyManager {
  constructor() {
    this.enemies = [];
    this.onWaveEnd = null;
  }

  /**
   * Spawns a new wave of enemies.
   * @param {number} n - number of enemies
   * @param {Object} [options]
   */
  startWave(n, options = {}) {
    this.enemies = [];
    // Simple placeholder: enemies line up at right, spaced horizontally
    for (let i = 0; i < n; ++i) {
      let x = window.GAME_CONSTANTS.WIDTH - 60 - i * 60;
      let y = window.GAME_CONSTANTS.GROUND_Y - 32;
      // If Enemy class not defined, add minimal placeholder
      if (typeof window.Enemy !== "function") {
        window.Enemy = class Enemy {
          constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 32;
            this.isAlive = true;
            this._scored = false;
          }
          update(player, dt) {
            // Simple AI: move left
            this.x -= 0.5;
            if (this.x < 0) this.isAlive = false;
          }
          draw(ctx) {
            ctx.save();
            ctx.fillStyle = "#f44";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          takeDamage(dmg) {
            this.isAlive = false;
          }
        };
      }
      this.enemies.push(new window.Enemy(x, y));
    }
  }

  /**
   * Updates all enemies. If all enemies are defeated, triggers wave end.
   * @param {Player} player
   * @param {number} dt
   */
  update(player, dt) {
    let allDefeated = true;
    for (let e of this.enemies) {
      if (e.isAlive) {
        e.update(player, dt);
        allDefeated = false;
      }
    }
    if (allDefeated && typeof this.onWaveEnd === "function") {
      this.onWaveEnd();
      this.onWaveEnd = null;
    }
  }

  /**
   * Draws all enemies to the canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    for (let e of this.enemies) {
      e.draw(ctx);
    }
  }
};