// ========== PLAYER SPRITE LOADING & ANIMATION ==========
const PLAYER_WALK_LEFT_FRAMES = [
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_1_1753755399811.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_2_1753755415493.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_3_1753755438859.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_4_1753755459773.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Coop_walk_left_5_1753755468791.png'
];
window.PlayerSpriteImages = PLAYER_WALK_LEFT_FRAMES.map(url => {
  const img = new window.Image();
  img.src = url;
  return img;
});

// ========== ENEMY SPRITE ANIMATION LOADING ==========

const ENEMY_ANIMATION_FRAMES = [
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_1_1753824654660.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_2_1753824672446.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_3_1753824680227.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_4_1753824688771.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_5_1753824699044.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_6_1753824709971.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_7_1753824720897.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_8_1753824730385.png',
  'https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0f84fe06-5c42-40c3-b563-1a28d18f37cc/library/Enemy_Ship_9_1753824738269.png'
];
window.EnemyAnimationImages = [];
for (let url of ENEMY_ANIMATION_FRAMES) {
  const img = new window.Image();
  img.src = url;
  window.EnemyAnimationImages.push(img);
}

// ========== PLAYER CLASS ==========
window.Player = class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = window.GAME_CONSTANTS.PLAYER.RADIUS; // 50% size
    this.color = window.GAME_CONSTANTS.PLAYER.COLOR;
    this.speed = window.GAME_CONSTANTS.PLAYER.MOVE_SPEED;
    this.jumpVel = window.GAME_CONSTANTS.PLAYER.JUMP_VELOCITY;
    this.velY = 0;
    this.grounded = false;
    this.facing = 1;

    this.stats = {
      hp: window.GAME_CONSTANTS.PLAYER.HP,
      maxHp: window.GAME_CONSTANTS.PLAYER.HP,
      attack: 8,
      defense: 0,
      speed: this.speed,
      jump: this.jumpVel,
      currency: 0,
      score: 0
    };

    // Attack
    this.attackCooldown = 0;
    this.attackDelay = window.GAME_CONSTANTS.PLAYER.ATTACK_COOLDOWN;

    // Shoot (Bubble Gun)
    this.shootCooldown = 0;
    this.shootDelay = window.GAME_CONSTANTS.PLAYER.SHOOT_COOLDOWN;
    this.projectiles = [];

    // Animation state
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 110; // ms per frame
    this.isMoving = false;
  }

  jump() {
    if (this.grounded) {
      this.velY = -this.jumpVel;
      this.grounded = false;
    }
  }

  attack(enemies) {
    if (this.attackCooldown > 0) return false;
    this.attackCooldown = this.attackDelay;

    let hit = false;
    const attackRadius = window.GAME_CONSTANTS.PLAYER.ATTACK_RADIUS; // 50% size
    for (let enemy of enemies) {
      if (!enemy.isAlive) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < attackRadius) {
        enemy.takeDamage(this.stats.attack, { cause: "melee" });
        hit = true;
      }
    }
    return hit;
  }

  shoot() {
    if (this.shootCooldown > 0) return false;
    this.shootCooldown = this.shootDelay;
    // Bubble projectile
    this.projectiles.push({
      x: this.x + this.facing * this.radius * 0.6,
      y: this.y - this.radius * 0.2,
      vx: 9 * this.facing,
      vy: -2.5,
      radius: 7.5, // 50% size
      life: 52
    });
    return true;
  }

  update(input, dt, world) {
    // Movement
    let moveDir = 0;
    if (input.isDown('left')) moveDir -= 1;
    if (input.isDown('right')) moveDir += 1;
    this.facing = moveDir !== 0 ? moveDir : this.facing;
    this.isMoving = moveDir !== 0;

    this.x += moveDir * this.speed;
    // Clamp to world bounds
    this.x = window.Utils.clamp(this.x, this.radius, window.GAME_CONSTANTS.WIDTH - this.radius);

    // Gravity
    this.velY += window.GAME_CONSTANTS.GRAVITY;
    this.y += this.velY;

    // Ground collision
    if (this.y + this.radius > window.GAME_CONSTANTS.GROUND_Y + 32) {
      this.y = window.GAME_CONSTANTS.GROUND_Y + 32 - this.radius;
      this.velY = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    // Attack cooldown
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.attackCooldown < 0) this.attackCooldown = 0;

    // Shoot cooldown
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.shootCooldown < 0) this.shootCooldown = 0;

    // Projectiles
    for (let p of this.projectiles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16;
      p.life -= 1;
    }
    // Remove expired projectiles
    this.projectiles = this.projectiles.filter(p => p.life > 0);

    // Projectile collision with enemies
    if (world && world.enemies) {
      for (let p of this.projectiles) {
        for (let e of world.enemies) {
          if (!e.isAlive) continue;
          const dx = e.x - p.x;
          const dy = e.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < e.size + p.radius) {
            e.takeDamage(this.stats.attack * 0.7, { cause: "projectile" });
            p.life = 0;
          }
        }
      }
    }

    // ===== Player Animation Logic =====
    if (this.isMoving) {
      this.animTimer += dt;
      if (this.animTimer > this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % window.PlayerSpriteImages.length;
      }
    } else {
      this.animFrame = 0; // Idle frame
      this.animTimer = 0;
    }
  }

  draw(ctx) {
    // Draw player sprite animation frames and mirror if facing right
    const frames = window.PlayerSpriteImages;
    let img = frames[this.animFrame];
    if (img && img.complete && img.naturalWidth && img.naturalHeight) {
      ctx.save();
      ctx.globalAlpha = 1.0;
      if (this.facing > 0) {
        // Mirror horizontally for right-facing
        ctx.translate(this.x + this.radius, this.y - this.radius);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, this.radius * 2, this.radius * 2);
      } else {
        ctx.drawImage(img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }
      ctx.restore();
    } else {
      // fallback: circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.97;
      ctx.shadowColor = '#0cf9';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.restore();
    }

    // Draw HP bar
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = "#222";
    ctx.fillRect(this.x - this.radius, this.y - this.radius - 20, this.radius * 2, 9);
    ctx.fillStyle = "#0ff";
    ctx.fillRect(this.x - this.radius, this.y - this.radius - 20, (this.radius * 2) * (this.stats.hp / this.stats.maxHp), 9);
    ctx.restore();

    // Draw projectiles
    for (let p of this.projectiles) {
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#7cf9ff";
      ctx.shadowColor = "#bff";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }
};

// ========== ENEMY CLASS ==========

// --- New enemy movement/divebomb logic below ---

window.Enemy = class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.size = window.GAME_CONSTANTS.ENEMY.SIZE;
    this.hp = window.GAME_CONSTANTS.ENEMY.HP;
    this.maxHp = window.GAME_CONSTANTS.ENEMY.HP;
    this.speed = window.GAME_CONSTANTS.ENEMY.SPEED;
    this.isAlive = true;
    this._scored = false;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 90; // ms per frame

    // PAUSE/SHOCK state
    this.pauseTimer = 0; // ms
    this.shakePower = 0; // pixels
    this._shakePhase = Math.random() * Math.PI * 2;

    // Flight AI
    this._oscPhase = Math.random() * Math.PI * 2; // randomize flight phase
    this._oscSpeed = 0.7 + Math.random() * 0.5; // unique up/down speed
    this._oscAmp = 36 + Math.random() * 22; // unique amplitude
    this._moveDir = Math.random() < 0.5 ? -1 : 1;
    this._moveSpeed = 1.2 + Math.random() * 0.6; // slightly different base speed

    // Divebombing
    this._diveCooldown = 1400 + Math.random() * 1800; // ms until possible next dive
    this._diveTimer = 0;
    this._diving = false;
    this._diveVelY = 0;
    this._diveTargetX = null;
    this._diveTargetY = null;
    this._divePhase = 0;
    this._returning = false;
  }

  update(player, dt) {
    if (!this.isAlive) return;

    // Handle pause/shake
    if (this.pauseTimer > 0) {
      this.pauseTimer -= dt;
      if (this.pauseTimer < 0) this.pauseTimer = 0;
      // No movement or animation during pause
      return;
    }

    // Animation timing
    this.animTimer += dt;
    if (this.animTimer > this.animSpeed) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % window.EnemyAnimationImages.length;
    }

    // --- Flight pattern: sinusoidal up/down, slow horizontal movement ---
    if (!this._diving && !this._returning) {
      // Up/down oscillation
      this._oscPhase += this._oscSpeed * dt * 0.001;
      this.y = this.baseY + Math.sin(this._oscPhase) * this._oscAmp;

      // Move horizontally across screen
      this.x += this._moveDir * this._moveSpeed;
      // If near edges, bounce back
      if (this.x < this.size + 20) {
        this.x = this.size + 20;
        this._moveDir = 1;
      } else if (this.x > window.GAME_CONSTANTS.WIDTH - this.size - 20) {
        this.x = window.GAME_CONSTANTS.WIDTH - this.size - 20;
        this._moveDir = -1;
      }

      // --- Divebomb logic ---
      this._diveTimer += dt;
      if (this._diveTimer > this._diveCooldown) {
        // 35% chance per allowed interval to divebomb
        if (Math.random() < 0.35) {
          this._diving = true;
          this._diveTargetX = player.x;
          this._diveTargetY = player.y - 8;
          // Store start for return
          this._diveStartX = this.x;
          this._diveStartY = this.y;
          this._divePhase = 0;
          this._diveDuration = 500 + Math.random() * 200; // ms for dive
        }
        this._diveCooldown = 1400 + Math.random() * 1800;
        this._diveTimer = 0;
      }
    }

    // --- Divebombing phase ---
    if (this._diving) {
      // Interpolate toward player using ease
      this._divePhase += dt;
      const t = Math.min(this._divePhase / this._diveDuration, 1);
      // Quadratic ease-in for fast dive
      const easeT = t * t;
      // Dive straight to target
      this.x = this._diveStartX + (this._diveTargetX - this._diveStartX) * easeT;
      this.y = this._diveStartY + (this._diveTargetY - this._diveStartY) * easeT;

      if (t >= 1) {
        this._diving = false;
        this._returning = true;
        this._returnPhase = 0;
        this._returnDuration = 600 + Math.random() * 220;
        this._returnStartX = this.x;
        this._returnStartY = this.y;
      }
    } else if (this._returning) {
      // Return to original flight path (baseY and current x)
      this._returnPhase += dt;
      const t = Math.min(this._returnPhase / this._returnDuration, 1);
      // Smooth ease-out
      const easeT = 1 - (1 - t) * (1 - t);
      this.x = this._returnStartX + (this._diveStartX - this._returnStartX) * easeT;
      this.y = this._returnStartY + (this.baseY + Math.sin(this._oscPhase) * this._oscAmp - this._returnStartY) * easeT;
      if (t >= 1) {
        this._returning = false;
        // Snap to path
        this.x = this._diveStartX;
        this.y = this.baseY + Math.sin(this._oscPhase) * this._oscAmp;
      }
    }
  }

  takeDamage(amount, opts = {}) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isAlive = false;
    }
    // Pause and shake effect only if alive after hit (or on death as well - up to you)
    if (this.isAlive) {
      this.pauseTimer = 180; // ms
      this.shakePower = 8; // pixels
      this._shakePhase = Math.random() * Math.PI * 2;
    }
  }

  draw(ctx) {
    if (!this.isAlive) return;

    // Shake offset
    let shakeX = 0, shakeY = 0;
    if (this.pauseTimer > 0 && this.shakePower > 0) {
      // Shake with decaying amplitude
      const t = this.pauseTimer / 180;
      const amp = this.shakePower * t;
      shakeX = Math.sin(performance.now() * 0.04 + this._shakePhase) * amp;
      shakeY = Math.cos(performance.now() * 0.055 + this._shakePhase) * amp * 0.65;
    }

    // Draw animated sprite with transparent background
    const img = window.EnemyAnimationImages[this.animFrame];
    if (img && img.complete && img.naturalWidth && img.naturalHeight) {
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.drawImage(
        img,
        this.x - this.size + shakeX,
        this.y - this.size + shakeY,
        this.size * 2,
        this.size * 2
      );
      ctx.restore();
    } else {
      // fallback: circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x + shakeX, this.y + shakeY, this.size, 0, 2 * Math.PI);
      ctx.fillStyle = '#fa4646';
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.restore();
    }

    // Optional: Draw HP bar above enemy
    if (this.isAlive && this.hp < this.maxHp) {
      ctx.save();
      const barWidth = this.size * 2;
      const barHeight = 6;
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#222";
      ctx.fillRect(this.x - this.size + shakeX, this.y - this.size - 16 + shakeY, barWidth, barHeight);
      ctx.fillStyle = "#f44";
      ctx.fillRect(this.x - this.size + shakeX, this.y - this.size - 16 + shakeY, barWidth * (this.hp / this.maxHp), barHeight);
      ctx.restore();
    }
  }
};

// ========== ENEMY MANAGER ==========

window.EnemyManager = class EnemyManager {
  constructor() {
    this.enemies = [];
    this.onWaveEnd = null;
  }

  startWave(count, opts) {
    this.enemies = [];
    // Spread enemies horizontally across right side, but in the air
    for (let i = 0; i < count; ++i) {
      const x = 700 + Math.random() * 180;
      const y = window.GAME_CONSTANTS.GROUND_Y - 82 - Math.random() * 88;
      this.enemies.push(new window.Enemy(x, y));
    }
  }

  update(player, dt) {
    for (let e of this.enemies) {
      e.update(player, dt);
    }
    // Remove defeated enemies after short delay
    this.enemies = this.enemies.filter(e => e.isAlive || !e._scored);

    // Check for end of wave
    if (typeof this.onWaveEnd === "function" && this.enemies.every(e => !e.isAlive)) {
      this.onWaveEnd();
    }
  }

  draw(ctx) {
    for (let e of this.enemies) {
      e.draw(ctx);
    }
  }
};