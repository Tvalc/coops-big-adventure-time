# Game Design Document

## Description
Overall game vision, mechanics, and core design decisions

## Content
```markdown
# Game Design Document  
## Title: Coop vs. the FUD Monsters

---

### 1. GAME VISION

**High Concept:**  
"Coop vs. the FUD Monsters" is a fast-paced, 2D side-scrolling beat-em-up inspired by SNES-era classics. Players control Coop, a charismatic hero, as he fights through waves of monstrous enemies representing fear, uncertainty, and doubt (FUD) in a world bursting with color, personality, and pixel art charm. The gameplay loop blends tight combat, skill progression, and replayable levels—optimized for instant, responsive browser play on desktop and mobile.

---

### 2. TARGET AUDIENCE

- Ages 10–40; fans of retro and arcade action
- Casual and core players seeking short, satisfying play sessions
- Players who enjoy skill trees, unlockables, and cosmetic progression
- Web gamers looking for instant, low-friction play (no download/install)

---

### 3. KEY DIFFERENTIATORS

- **Instant browser play**: No downloads, instant load, responsive touch/mouse controls.
- **SNES-style pixel art**: Nostalgic visuals, but with modern polish.
- **Dynamic, replayable levels**: Procedural enemy waves and secret drops.
- **Skill & gear progression**: Unlocks and meaningful upgrades after each stage.
- **Tongue-in-cheek FUD Monster theme**: Socially aware, with comic and serious undertones.

---

### 4. CORE GAMEPLAY LOOP

1. **Enter Stage:**  
   - Choose unlocked skills and gear.
   - See Coop’s current cosmetic look.

2. **Combat Sequence:**  
   - Side-scroll through 10 scenes per stage.
   - Defeat 10 waves per scene (1–5 random FUD Monsters per wave).
   - Collect drops (currency, power-ups, secrets).

3. **Boss Encounter:**
   - Mini-boss at end of each stage.
   - Level boss at end of each level (every 10 stages).

4. **Progression & Rewards:**  
   - Unlock new skills/combos/passives.
   - Upgrade/equip new gear (visual and mechanical changes).
   - Discover secret items and lore.

5. **Repeat/Advance:**  
   - Advance to next stage or replay for better scores/unlocks.

---

### 5. GAME STRUCTURE & FLOW

#### Levels, Stages, Scenes, and Waves

| Structure   | Quantity             | Details                                                   |
|-------------|----------------------|-----------------------------------------------------------|
| Levels      | 10                   | Each with unique thematic art & boss                      |
| Stages      | 10 per Level         | Each with 10 scenes, ends with mini-boss                  |
| Scenes      | 10 per Stage         | Unique background per scene                               |
| Waves       | 10 per Scene         | Each wave spawns 1–5 random enemies                       |

- **Procedural randomization** for enemy types per wave, with increasing difficulty.
- **Bosses:**  
  - **Mini-boss:** Concludes each stage (special abilities/gimmicks).  
  - **Level boss:** Concludes each level (multi-phase, unlocks new gameplay).

---

### 6. CHARACTERS

#### Main Character – Coop

- **Visuals:** Black sunglasses, beige jacket, red triangle motif.
- **Combat:**  
  - **Punch:** Quick, short-range combo (tap A/Touch)
  - **Kick:** Slower, wider arc (hold A/Swipe down)
  - **Bubble Gun:** Ranged, stuns or juggles enemies (B/Touch bubble icon)
- **Progression:**  
  - Unlocks new combos, air attacks, passive abilities (e.g., health regen, counterattack)
  - Equips new gloves, jacket, bubble gun mods (change visuals/stats)

---

### 7. ENEMIES

#### FUD Monsters (Examples)
- **Rugpull Rat:** Fast dashes, steals pickups if not defeated quickly
- **Doomposter:** Ranged attacks (projectile spam), causes fear debuff
- **Token Zombie:** Slow, high HP, can “infect” Coop (temporary debuff)
- **Chart Crasher:** Jumps and slams ground, causes shockwaves
- **Fake Guru:** Buffs nearby enemies, can teleport

- **Behavior Variants:**  
  - Dash attacks, ranged throws, buffs, debuffs, split on death, etc.

---

### 8. ENEMY DROPS

- **Currency:** For upgrades (visible as coins/bit icons)
- **Temporary Power-Ups:**
  - Invincibility (shimmer effect)
  - Damage boost (glowing fists)
  - Heal (heart icon)
- **Secret Items:**
  - Cosmetic unlocks (e.g., new sunglasses, jackets)
  - Easter eggs (hidden references, bonus art)
  - Lore entries (collectible story bits)

---

### 9. PROGRESSION & REWARDS

- **Stage Completion:** Select from 2–3 new skill/gear unlocks or upgrades.
  - **Skills:** New combos, specials, air attacks, passives (e.g., “Combo Extender”)
  - **Gear:** Visual and stat changes (e.g., “Spiked Gloves” +10% crit)
- **Skill Tree:**  
  - Branching paths (offense/defense/utility), player can respec between levels.
- **Persistent Currency:** Used for upgrades outside of combat.
- **Unlockables:** Cosmetics, lore entries, secret stages/mini-games.

---

### 10. BOSSES

- **Mini-Boss (per stage):**  
  - Larger, themed FUD Monster with unique attack pattern (e.g., “Fear Monger” summons minions, “Uncertainty Blob” splits into smaller forms).
- **Level Boss (per level):**  
  - Multi-phase, screen-filling monsters (e.g., “The Great Panic,” “Doubt Hydra”).
  - Bosses drop major loot (new skills, gear, or passives).
  - Defeating a boss may unlock new gameplay systems (e.g., co-op mode, endless mode).

---

### 11. VISUAL & AUDIO STYLE

- **Graphics:** SNES-style 16-bit pixel art, 4–8 frames per animation for Coop and enemies. Parallax backgrounds, bright palettes, clear silhouettes.
- **Tone:**  
  - Colorful, humorous, occasional serious themes about “FUD” in digital life.
  - Exaggerated enemy designs and visual gags.
- **Sound:**  
  - Chiptune soundtrack, dynamic based on combat/bosses.
  - Punchy, arcade-style hit effects.
  - Coop: Occasional voice barks (“Let’s clear the FUD!”), text pop-ups for jokes/callbacks.

---

### 12. INPUT, UI & RESPONSIVENESS

- **Controls:**  
  - Mouse + Keyboard: Arrow keys/WASD for movement, A/S/D for actions.
  - Touch: On-screen joystick + 3 action buttons (Punch, Kick, Bubble Gun), swipe for special moves.
- **UI:**  
  - Minimalist, diegetic HUD (health, power-up status, currency).
  - Responsive scaling for desktop, tablet, and mobile screens.
  - Pause/options accessible at any time.
- **Performance:**  
  - Efficient asset management (texture atlases, pooling).
  - Cap enemy count per wave for smooth browser performance.
  - Animation and audio fallback for low-end devices.

---

### 13. SUCCESS METRICS

- **Player Retention:**  
  - % of players completing level 1, 2, etc.
  - # of repeat play sessions per player.
- **Engagement:**  
  - Average session length.
  - Skills/gear unlocked per player.
- **Replayability:**  
  - % of players replaying stages for secrets/completion.
- **Performance Benchmarks:**  
  - <3 seconds to load on modern browsers.
  - Consistently >40fps on mobile/desktop.
- **User Feedback:**  
  - Positive ratings on UX, controls, and visual/auditory experience.

---

### 14. IMPLEMENTATION CONSIDERATIONS (SNIB AI Game Platform)

- **Instant load:** Prioritize small initial asset footprint, lazy-load backgrounds/music.
- **Input flexibility:** Ensure seamless transition between touch and mouse/keyboard.
- **Responsive design:** Anchor UI to edges, scale sprites/UI with viewport.
- **Session saving:** Auto-save progression, unlocks, and cosmetics.
- **Performance:** Limit concurrent enemies, optimize collision checks, cap particle effects.

---

### 15. FUTURE EXPANSIONS (OPTIONAL)

- **Local/online co-op mode.**
- **Endless mode with leaderboards.**
- **Seasonal or event-based FUD Monsters/bosses.**
- **Community cosmetic contests.**

---

## APPENDIX: SAMPLE STAGE LAYOUT

**Level 1: "FUD Alley"**  
- Stage 1-1: City street, neon signs, parallax skyline.
  - Scene 1: Straight street, puddles, trash cans (breakable for power-ups).
  - ...
  - Scene 10: Rooftop showdown.
  - Mini-boss: “Doomposter” perched on billboard.
- Level 1 Boss: “Rugpull Rat King” — multi-phase, chases Coop across screens.

---

# END OF DOCUMENT
```



---
*Generated on 7/28/2025*
