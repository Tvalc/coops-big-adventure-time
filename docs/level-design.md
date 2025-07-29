# Level Design Document

## Description
Individual level layouts, progression, and mechanics

## Content
```markdown
# Level Design Document  
## Game Title: Coop vs. the FUD Monsters

---

### 1. Overview

This document details the level structure, progression, pacing, difficulty, environment, and player guidance for **Coop vs. the FUD Monsters**—a 2D side-scrolling beat-em-up built for the Snib AI Game Platform, targeting web browsers with SNES-style pixel graphics.

---

### 2. Level Structure

#### 2.1 Macro Structure

- **Total Levels:** 10  
- **Stages per Level:** 10 (e.g., Level 1: Stages 1-1 to 1-10)  
- **Scenes per Stage:** 10 (unique backgrounds, environmental storytelling)  
- **Waves per Scene:** 10 (1–5 enemies per wave, random selection)  
- **Boss Battles:**  
  - **Mini-Boss:** End of every stage (Scene 10)  
  - **Level Boss:** End of every level (after Stage 10)  

#### 2.2 Micro Structure

- **Each Scene Layout:**  
  - **Horizontal Play Area:** 4:3 aspect ratio, responsive to window size  
  - **Platform Design:** Flat ground with occasional multi-level platforms, destructible props (barrels, crates)  
  - **Boundaries:** Left/right screen edges, Coop cannot backtrack past left edge  
  - **UI:** HUD for HP (health), score, currency, power-up status, and wave indicator; touch/mouse control overlays  

---

### 3. Level Progression & Pacing

#### 3.1 Difficulty Curve

- **Level 1:** Tutorial elements, slow enemy spawns, minimal hazards
- **Levels 2–5:** Gradually introduce new enemies (with unique mechanics), minor environmental hazards (spikes, pits), and more complex waves
- **Levels 6–9:** Higher enemy counts, mixed enemy types per wave, faster spawn rates, multi-layered arenas, more power-up drops
- **Level 10:** Final gauntlet, frequent mini-bosses, elite enemies, and a multi-phase end boss

#### 3.2 Player Guidance

- **Visual cues:** Arrows, glowing objects, animated “Go!” signposts
- **Tutorial popups:** For new mechanics (jump, collect, power-up, upgrade)
- **Environmental hints:** e.g., cracked walls for secret areas, distinct background colors for dangerous zones

#### 3.3 Pacing

- **Scene Duration:** 45–120 seconds per scene, based on wave speed and player skill
- **Rest Areas:** After mini-bosses, provide “upgrade rooms” (no combat, select rewards/gear)
- **Boss Fights:** Dramatic music shift, unique backgrounds, telegraphed attacks, multiple stages

---

### 4. Environmental Storytelling

- **Backgrounds:**  
  - Each scene in a stage features a distinct backdrop (e.g., city street, alleyway, rooftop, server farm, meme museum)
  - Visual progression tells a mini-story (e.g., moving from surface to underground lair)
  - Occasional animated details—billboards, NPCs fleeing, corrupted crypto logos

- **Secret Areas:**  
  - Hidden platforms or destructible walls
  - Reward: secret items (cosmetics, lore entries)

- **Interactive Props:**  
  - Breakable crates/barrels: may drop currency, health, or power-ups
  - Environmental hazards: electrified floors, rolling barrels

---

### 5. Objectives & Interactive Elements

#### 5.1 Core Objectives

- **Main:**  
  - Defeat all enemy waves to advance to the next scene
  - Survive mini-boss and boss encounters to progress

- **Secondary:**  
  - Collect currency for upgrades
  - Find and collect secret items

#### 5.2 Interactive Elements

- **Power-ups:**  
  - Temporary invincibility, damage boost, health restore
  - Appear mid-wave or from destroyed props/enemies

- **Currency Pickups:**  
  - Dropped by enemies or props, auto-collect within range

- **Upgrade Stations:**  
  - Between stages, player can choose upgrades/gear (new gloves, bubble gun mods, armor)

---

### 6. Enemy Spawning & Variety

#### 6.1 Enemy Waves

- **Wave Mechanics:**  
  - Each scene: 10 waves, increasing in challenge
  - Each wave: 1–5 enemies of randomized types, scaling by level
  - Enemies enter from right or drop from above

#### 6.2 Enemy Types

- **Rugpull Rat:** Fast, low HP, dash attacks
- **Doomposter:** Ranged, throws “bad news” projectiles
- **Token Zombie:** Slow, high HP, can grab player
- **Chart Crasher:** Leaps, causes AOE shockwaves
- **Fake Guru:** Buffs nearby monsters, can teleport

---

### 7. Boss Encounters

#### 7.1 Mini-Bosses

- **Unique mechanics per stage (e.g., shield, clones, environmental attacks)**
- **Telegraphed attack patterns**
- **Greater HP and damage**

#### 7.2 Level Bosses

- **Multi-phase fights:** Changing movesets/environment
- **Larger-than-life pixel art sprites**
- **Special voice lines and dramatic music**
- **Drop unique loot and unlock abilities/gear**

---

### 8. Progression & Rewards

- **Between Stages:**  
  - Select new skills (e.g., double jump, combo finisher)
  - Upgrade gear (e.g., gloves with elemental effects, bubble gun range)
  - Unlock lore entries or cosmetic rewards for secret finds

- **Score:**  
  - Based on enemy defeat, combo chains, secrets found, speed
  - Leaderboard integration for replayability

---

### 9. UI & Accessibility

- **Touch/Mobile:**  
  - Large, on-screen buttons for attack, jump, special, movement
  - Responsive scaling for portrait/landscape

- **Mouse/Keyboard:**  
  - Click/tap for pickup/interaction
  - Hotkeys for abilities and upgrades

- **HUD Elements:**  
  - Health bar (hp), power-up timer, score, currency, stage/wave tracker

---

### 10. Performance & Streaming

- **Asset Management:**  
  - Sprite sheets and audio chunks preloaded per stage
  - Backgrounds and enemy assets streamed as player advances

- **Optimization:**  
  - Limit simultaneous enemy sprites to 8–10
  - Reuse background elements with palette swaps for variety
  - Use compressed audio formats for chiptunes/voice

---

### 11. Example: Level 1 (The Crypto City Streets)

- **Stage 1-1:**  
  - Scene 1: Neon-lit avenue, tutorial prompts for jump/attack/collect
  - Scene 2–9: Back alleys, rooftops, subway entrance; waves of Rugpull Rats and Token Zombies, destructible newsstands
  - Scene 10: Mini-boss “FUD Bus Driver” (AOE horn attack, summons minions)
  - Stage Complete: Upgrade room, choose bubble gun mod or health boost
- **Level Boss:**  
  - “Mega Doomposter” on rooftop, multi-phase, uses billboard projectiles

---

### 12. Consistency & Mechanics Reference

- **Mechanics Referenced:**  
  - **Jump:** Used for platforming, dodging
  - **Collect:** For currency, power-ups, secrets
  - **Power-up:** Temporary benefits from drops
  - **Enemies:** All FUD Monster variants
  - **Score:** Tracked per scene, influences rewards
  - **Health/HP:** Coop’s survivability, restored via pickups
  - **Upgrade:** Between stages/levels, skills and gear

---

### 13. Potential Conflicts/Notes

- Ensure all mechanics (jump, collect, power-up, enemies, score, health, hp, upgrade) are present in level scripting and UI
- If additional mechanics or enemy types are introduced, update the core game design document for consistency

---

### 14. Asset Checklist per Scene

- Background image (responsive, 16-bit style)
- Platform/ground sprites
- Enemy sprite sheets (per wave)
- Power-up icons
- Currency/secret item icons
- HUD elements (scalable)
- Sound cues (scene-specific, wave start/end, boss music)

---

### 15. Summary

This level design framework ensures tightly paced, visually engaging, and mechanically rich stages optimized for browser play. Each level should balance action, exploration, and progression while maintaining performance and accessibility across devices.
```



---
*Generated on 7/28/2025*
