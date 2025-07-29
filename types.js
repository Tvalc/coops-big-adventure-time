// Type-like JSDoc annotations for clarity

/**
 * @typedef {Object} PlayerStats
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} attack
 * @property {number} defense
 * @property {number} speed
 * @property {number} jump
 * @property {number} currency
 * @property {number} score
 */

/**
 * @typedef {Object} EnemyConfig
 * @property {number} hp
 * @property {number} speed
 * @property {string} color
 * @property {number} attack
 * @property {number} reward
 */

/**
 * @typedef {Object} LevelMeta
 * @property {number} level
 * @property {number} stage
 * @property {number} scene
 * @property {number} wave
 */

/**
 * @typedef {Object} ProgressionState
 * @property {LevelMeta} current
 * @property {number} unlockedLevel
 * @property {Object} upgrades
 * @property {Object} skills
 */

/**
 * @typedef {'heal' | 'attackUp' | 'speedUp' | 'invincible'} PowerUpType
 */