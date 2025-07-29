// =============== Input System ===============
window.InputSystem = class InputSystem {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.attack = false;
    this.shoot = false; // Bubble Gun (K)
    // One-shot trigger flags for attack and shoot actions
    this._attackPressed = false;
    this._attackConsumed = false;
    this._shootPressed = false;
    this._shootConsumed = false;
    // Touch support
    this.touchDir = 0;
    this.touchJump = false;
    this.touchAttack = false;
    this._setup();
  }
  _setup() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = true;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') this.up = true;
      // --- Attack (J/Z): One-shot trigger ---
      if (e.code === 'KeyJ' || e.code === 'KeyZ') {
        this.attack = true;
        if (!this._attackPressed) {
          this._attackPressed = true;
          this._attackConsumed = false;
        }
      }
      // --- Shoot (K): One-shot trigger ---
      if (e.code === 'KeyK') {
        this.shoot = true;
        if (!this._shootPressed) {
          this._shootPressed = true;
          this._shootConsumed = false;
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = false;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') this.up = false;
      if (e.code === 'KeyJ' || e.code === 'KeyZ') {
        this.attack = false;
        this._attackPressed = false; // Reset one-shot trigger on key release
        this._attackConsumed = false;
      }
      if (e.code === 'KeyK') {
        this.shoot = false;
        this._shootPressed = false; // Reset one-shot trigger on key release
        this._shootConsumed = false;
      }
    });
    // Touch controls (simple left/right/jump/attack)
    // TODO: Add on-screen buttons for mobile
  }
  /**
   * Consume one-shot attack input (melee, mapped to J/Z).
   * Returns true only once per key press.
   * @returns {boolean}
   */
  consumeAttack() {
    if (this._attackPressed && !this._attackConsumed) {
      this._attackConsumed = true;
      return true;
    }
    return false;
  }
  /**
   * Consume one-shot jump input.
   * @returns {boolean}
   */
  consumeJump() {
    const val = this.up;
    this.up = false;
    return val;
  }
  /**
   * Consume one-shot shoot input (bubble gun, mapped to K).
   * Returns true only once per key press.
   * @returns {boolean}
   */
  consumeShoot() {
    if (this._shootPressed && !this._shootConsumed) {
      this._shootConsumed = true;
      return true;
    }
    return false;
  }
};

// =============== Progression System ===============
window.ProgressionSystem = class ProgressionSystem {
  constructor() {
    this.state = {
      current: { level: 1, stage: 1, scene: 1, wave: 1 },
      unlockedLevel: 1,
      upgrades: {},
      skills: {}
    };
  }
  advanceWave() {
    let c = this.state.current;
    c.wave++;
    if (c.wave > window.GAME_CONSTANTS.WAVES) {
      c.wave = 1;
      c.scene++;
      // TODO: Handle scene/level progression
    }
    // TODO: Handle end of level logic
  }
  // TODO: Add upgrade/skill unlocks
};