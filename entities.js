// =================== Coop Sprite Animation Helper ===================
const COOP_ANIMATION_CONFIG = {
  FRAME_WIDTH: 32,
  FRAME_HEIGHT: 48,
  WALK_FRAME_COUNT: 5,
  WALK_FRAME_DURATION: 140, // ms per frame: SNES pacing ~0.12-0.16s
  IMAGE_URLS: [
    // RESTORED: Original Coop walk cycle image URLs (left-facing, SNES-style, 32x48 PNG)
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
window.BubbleProjectile = class BubbleProjectile {
  /**
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   * @param {number} dir - Direction: 1 for right, -1 for left.
   */
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.radius = 14;
    this.speed = 8 * dir; // dir: 1 (right), -1 (left)
    this.vx = this.speed;
    this.vy = 0;
    this.lifetime = 1200; // ms
    this.isDestroyed = false;
    this.damage = 8; // Match design doc: bubble gun base damage
  }

  /**
   * Update projectile position and collision.
   * @param {Array} enemies - Array of enemy objects.
   * @param {number} dt - Delta time (ms).
   */
  update(enemies, dt) {
    if (this.isDestroyed) return;
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime -= dt;
    // Destroy if off-screen
    if (
      this.x < -this.radius ||
      this.x > window.GAME_CONSTANTS.WIDTH + this.radius ||
      this.lifetime <= 0
    ) {
      this.isDestroyed = true;
      return;
    }
    // Collision with enemies
    for (let e of enemies) {
      if (e.isAlive) {
        const dx = e.x - this.x, dy = e.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.radius + e.size / 2) {
          if (typeof e.takeDamage === "function") {
            e.takeDamage(this.damage);
          }
          this.isDestroyed = true;
          break;
        }
      }
    }
  }

  /**
   * Render the projectile.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.isDestroyed) return;
    ctx.save();
    // Bubble: blue with white highlight
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    let grad = ctx.createRadialGradient(
      this.x, this.y, this.radius * 0.3,
      this.x, this.y, this.radius
    );
    grad.addColorStop(0, "#fff");
    grad.addColorStop(0.4, "#bbf7ff");
    grad.addColorStop(1, "#3ec6ff");
    ctx.fillStyle = grad;
    ctx.shadowColor = "#0ff";
    ctx.shadowBlur = 12;
    ctx.fill();
    // Highlight
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(this.x - this.radius / 3, this.y - this.radius / 3, this.radius / 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
  }
};

// =================== Player Class ===================
window.Player = class Player {
  /**
   * Creates the player character.
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   */
  constructor(x, y) {
    const C = window.GAME_CONSTANTS.PLAYER;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 36; // Rendered radius, slightly larger than base for hitbox
    this.grounded = false;
    this.facing = 1; // 1 = right, -1 = left
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackArc = C.ATTACK_ARC;
    this.attackRadius = C.ATTACK_RADIUS * 2;
    this.attackCooldown = C.ATTACK_COOLDOWN;
    this.shootCooldown = C.SHOOT_COOLDOWN;
    this.shootTimer = 0;
    this.moveSpeed = C.MOVE_SPEED;
    this.jumpVelocity = C.JUMP_VELOCITY;
    this.color = C.COLOR;
    this.projectiles = [];
    this._walkAnimT = 0;
    this._walkFrame = 0;
    this._walkImages = [];
    this._walkImagesLoaded = false;

    // Player stats
    this.stats = {
      hp: C.HP,
      maxHp: C.HP,
      attack: 12,
      bubbleDmg: 8,
      score: 0,
      currency: 0
    };

    // Preload walk cycle images (left-facing, flip for right)
    this._walkImages = preloadImages(COOP_ANIMATION_CONFIG.IMAGE_URLS, (imgs) => {
      this._walkImagesLoaded = true;
    });
  }

  /**
   * Resets the player state for a fresh game start or respawn.
   * (Call on restart if needed)
   */
  reset(x, y) {
    const C = window.GAME_CONSTANTS.PLAYER;
    this.x = x || 120;
    this.y = y || (window.GAME_CONSTANTS.GROUND_Y - window.GAME_CONSTANTS.PLAYER.RADIUS);
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.facing = 1;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.shootTimer = 0;
    this.projectiles = [];
    this._walkAnimT = 0;
    this._walkFrame = 0;
    this.stats = {
      hp: C.HP,
      maxHp: C.HP,
      attack: 12,
      bubbleDmg: 8,
      score: 0,
      currency: 0
    };
    // Walk images do not need reload, will be reused if loaded
  }

  /**
   * Update player position, state, and projectiles.
   * @param {InputSystem} input
   * @param {number} dt
   * @param {Object} world - {enemies}
   */
  update(input, dt, world) {
    // Movement input
    let left = input.isDown("left"), right = input.isDown("right");
    let moving = false;
    if (left && !right) {
      this.vx = -this.moveSpeed;
      this.facing = -1;
      moving = true;
    } else if (right && !left) {
      this.vx = this.moveSpeed;
      this.facing = 1;
      moving = true;
    } else {
      this.vx = 0;
    }

    // Horizontal movement
    this.x += this.vx;

    // Gravity
    this.vy += window.GAME_CONSTANTS.GRAVITY;
    this.y += this.vy;

    // Floor collision
    if (this.y + this.radius > window.GAME_CONSTANTS.GROUND_Y + 24) {
      this.y = window.GAME_CONSTANTS.GROUND_Y + 24 - this.radius;
      this.vy = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    // Clamp to world bounds
    this.x = Math.max(this.radius, Math.min(window.GAME_CONSTANTS.WIDTH - this.radius, this.x));
    this.y = Math.min(window.GAME_CONSTANTS.GROUND_Y + 24 - this.radius, this.y);

    // Attack cooldown
    if (this.attackTimer > 0) this.attackTimer -= dt;
    if (this.shootTimer > 0) this.shootTimer -= dt;

    // Update projectiles
    for (let p of this.projectiles) {
      p.update(world.enemies, dt);
    }
    // Remove destroyed
    this.projectiles = this.projectiles.filter(p => !p.isDestroyed);

    // Walk animation
    if (moving) {
      this._walkAnimT += dt;
      if (this._walkAnimT > COOP_ANIMATION_CONFIG.WALK_FRAME_DURATION) {
        this._walkFrame = (this._walkFrame + 1) % COOP_ANIMATION_CONFIG.WALK_FRAME_COUNT;
        this._walkAnimT = 0;
      }
    } else {
      this._walkFrame = 0;
      this._walkAnimT = 0;
    }
  }

  /**
   * Player jump action.
   */
  jump() {
    if (this.grounded) {
      this.vy = -this.jumpVelocity;
      this.grounded = false;
    }
  }

  /**
   * Player attack action - melee swing.
   * @param {Array} enemies
   * @returns {boolean} True if any enemy was hit
   */
  attack(enemies) {
    if (this.attackTimer > 0) return false;
    this.attackTimer = this.attackCooldown;
    let hit = false;
    // Attack arc: from facing direction, in front of the player
    let px = this.x + this.facing * this.radius * 0.7;
    let py = this.y;
    let arcCenter = Math.atan2(0, this.facing); // 0 or PI

    for (let e of enemies) {
      if (!e.isAlive) continue;
      let dx = e.x - px, dy = e.y - py;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.attackRadius + e.size / 2) {
        // Arc check
        let ang = Math.atan2(dy, dx);
        let diff = Math.abs(window.Utils.angleDiff(arcCenter, ang));
        if (diff < this.attackArc / 2) {
          if (typeof e.takeDamage === "function") {
            e.takeDamage(this.stats.attack);
            hit = true;
          }
        }
      }
    }
    this.isAttacking = true;
    setTimeout(() => { this.isAttacking = false; }, 180);
    return hit;
  }

  /**
   * Player shoot action - fires a bubble projectile.
   */
  shoot() {
    if (this.shootTimer > 0) return false;
    this.shootTimer = this.shootCooldown;
    // Bubble appears slightly in front of player
    let px = this.x + this.facing * (this.radius - 10);
    let py = this.y - 10;
    let proj = new window.BubbleProjectile(px, py, this.facing);
    this.projectiles.push(proj);
    return true;
  }

  /**
   * Render the player and projectiles.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    // Draw projectiles
    for (let p of this.projectiles) {
      p.draw(ctx);
    }

    ctx.save();

    // Sprite animation if loaded
    if (this._walkImagesLoaded && this._walkImages[this._walkFrame]) {
      ctx.save();
      ctx.translate(this.x, this.y - 8);
      ctx.scale(-this.facing, 1); // <-- CHANGED: flip horizontally when facing right
      ctx.drawImage(
        this._walkImages[this._walkFrame],
        -COOP_ANIMATION_CONFIG.FRAME_WIDTH / 2,
        -COOP_ANIMATION_CONFIG.FRAME_HEIGHT / 2,
        COOP_ANIMATION_CONFIG.FRAME_WIDTH,
        COOP_ANIMATION_CONFIG.FRAME_HEIGHT
      );
      ctx.restore();
    } else {
      // Fallback: simple circle body
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.restore();
    }

    // Attack arc indicator (debug or effect)
    if (this.isAttacking) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.facing === 1 ? 0 : Math.PI);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0, 0,
        this.attackRadius,
        -this.attackArc / 2,
        this.attackArc / 2
      );
      ctx.closePath();
      ctx.fillStyle = "#ff0";
      ctx.fill();
      ctx.restore();
    }

    // HP Bar
    ctx.save();
    let barW = 56, barH = 7;
    let hpPct = this.stats.hp / this.stats.maxHp;
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#222";
    ctx.fillRect(this.x - barW / 2, this.y - this.radius - 22, barW, barH);
    ctx.fillStyle = "#0ff";
    ctx.fillRect(this.x - barW / 2 + 1, this.y - this.radius - 21, (barW - 2) * hpPct, barH - 2);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(this.x - barW / 2, this.y - this.radius - 22, barW, barH);
    ctx.restore();

    ctx.restore();
  }
};

// =================== PowerUp Entity ===================
// ... (no changes required here, omitted for brevity) ...

// =================== Enemy Class ===================
// ... (no changes required here) ...

// =================== EnemyManager (spawn & update enemies per wave) ===================

// --- BEGIN FIX: Ensure EnemyManager is attached to window and is a constructor ---

window.EnemyManager = class EnemyManager {
  constructor() {
    this.enemies = [];
    this.onWaveEnd = null; // Callback when wave is cleared
    this._waveActive = false;
    this._waveTimer = 0;
  }

  /**
   * Spawn a new wave of enemies.
   * @param {number} count - How many enemies to spawn.
   * @param {object} opts - Options (unused for now).
   */
  startWave(count, opts) {
    this.enemies = [];
    for (let i = 0; i < count; ++i) {
      // Place enemies somewhat spread out horizontally
      let x = 580 + i * 56 + Math.random() * 30;
      let y = window.GAME_CONSTANTS.GROUND_Y - 16;
      this.enemies.push(new window.Enemy(x, y));
    }
    this._waveActive = true;
    this._waveTimer = 0;
  }

  /**
   * Update all enemies, handle wave completion.
   * @param {Player} player
   * @param {number} dt
   */
  update(player, dt) {
    let alive = 0;
    for (let e of this.enemies) {
      if (e.isAlive) {
        e.update(player, dt);
        alive++;
      }
    }
    // Check if wave cleared
    if (this._waveActive && alive === 0) {
      this._waveActive = false;
      // Give a slight delay before calling onWaveEnd (for visuals)
      if (typeof this.onWaveEnd === "function") {
        setTimeout(() => this.onWaveEnd(), 450);
      }
    }
  }

  /**
   * Draw all enemies.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    for (let e of this.enemies) {
      e.draw(ctx);
    }
  }
};

// --- END FIX ---

// --- Ensure window.Enemy exists for EnemyManager (for completeness in this snippet) ---
if (typeof window.Enemy !== "function") {
  window.Enemy = class Enemy {
    constructor(x, y) {
      const C = window.GAME_CONSTANTS.ENEMY;
      this.x = x;
      this.y = y;
      this.size = C.SIZE;
      this.color = C.COLOR;
      this.hp = C.HP;
      this.isAlive = true;
      this._vx = window.Utils.randBetween(-2, -0.6);
      this._vy = 0;
      this.attackCooldown = C.ATTACK_COOLDOWN;
      this._attackTimer = 0;
      this._scored = false;
    }
    update(player, dt) {
      if (!this.isAlive) return;
      // Basic AI: Move towards the player and jump randomly
      let dx = player.x - this.x;
      let dist = Math.abs(dx);
      if (dist > 8) {
        this.x += Math.sign(dx) * window.GAME_CONSTANTS.ENEMY.SPEED;
      }
      // Simulate gravity
      this._vy += window.GAME_CONSTANTS.GRAVITY * 0.6;
      this.y += this._vy;
      // Ground collision
      if (this.y + this.size / 2 > window.GAME_CONSTANTS.GROUND_Y + 20) {
        this.y = window.GAME_CONSTANTS.GROUND_Y + 20 - this.size / 2;
        this._vy = 0;
      }
      // Attack
      this._attackTimer -= dt;
      if (this._attackTimer <= 0 && dist < 60) {
        this._attackTimer = this.attackCooldown;
        player.stats.hp -= 10;
      }
      // Die if hp falls below zero
      if (this.hp <= 0) {
        this.isAlive = false;
      }
    }
    takeDamage(dmg) {
      this.hp -= dmg;
      if (this.hp <= 0) {
        this.isAlive = false;
      }
    }
    draw(ctx) {
      if (!this.isAlive) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = "#fa4";
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.97;
      ctx.fill();
      ctx.restore();
      // HP bar
      ctx.save();
      let barW = 36, barH = 5;
      let hpPct = Math.max(0, this.hp / window.GAME_CONSTANTS.ENEMY.HP);
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "#222";
      ctx.fillRect(this.x - barW / 2, this.y - this.size / 2 - 10, barW, barH);
      ctx.fillStyle = "#fa4";
      ctx.fillRect(this.x - barW / 2 + 1, this.y - this.size / 2 - 9, (barW - 2) * hpPct, barH - 2);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(this.x - barW / 2, this.y - this.size / 2 - 10, barW, barH);
      ctx.restore();
    }
  };
}