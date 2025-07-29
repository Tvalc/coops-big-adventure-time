// Game constants and config
window.GAME_CONSTANTS = {
  WIDTH: 960,
  HEIGHT: 540,
  PLAYER: {
    RADIUS: 32, // Keep as base value (for reference, but we double radius in Player now)
    MOVE_SPEED: 5,
    JUMP_VELOCITY: 16,
    COLOR: '#0ff',
    HP: 100,
    ATTACK_COOLDOWN: 400,
    ATTACK_RADIUS: 44,  // For hit detection, we double this in Player.attack
    ATTACK_ARC: Math.PI / 2,
    SHOOT_COOLDOWN: 500 // (ms) Bubble Gun cooldown
  },
  ENEMY: {
    SIZE: 32,
    SPEED: 2.6,
    COLOR: '#fa4646',
    HP: 24,
    ATTACK_COOLDOWN: 1000
  },
  LEVELS: 10, STAGES: 10, SCENES: 10, WAVES: 10,
  GRAVITY: 1.18,
  GROUND_Y: 430,
  BG_COLORS: ['#22334d', '#1b2238', '#1a1f33', '#293a5a'],
  SCORE_PER_ENEMY: 100,
  CURRENCY_PER_ENEMY: 3
};