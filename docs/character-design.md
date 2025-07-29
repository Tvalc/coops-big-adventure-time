# Character Design Document

## Description
Character profiles, abilities, and backstories

## Content
```markdown
# Character Design Document  
## Game Title: Coop vs. the FUD Monsters  
## Document Type: Character Design  
## Main Character: Coop

---

### 1. Overview

**Coop** is the player-controlled protagonist of "Coop vs. the FUD Monsters," a 2D side-scrolling beat-em-up inspired by SNES-era pixel classics. Coop embodies resilience and optimism, fighting embodiments of fear, uncertainty, and doubt in a fast-paced, colorful world.

---

### 2. Visual Design

#### 2.1. Sprite Specifications

- **Resolution:** 32x48 px per frame (base character), with separate layers for gear/cosmetics
- **Sprite Sheets:** WebP or PNG format, ≤2MB per sheet  
- **Animation Frames:**
  - Idle: 4 frames
  - Walk: 8 frames
  - Run: 6 frames
  - Jump: 4 frames (ascend, peak, descend, land)
  - Attack (punch/kick/combo): 6–10 frames per move
  - Bubble Gun: 6 frames (raise, fire, recoil)
  - Hurt/Knockback: 4 frames
  - Special Move: 8–12 frames (unique per unlocked move)
  - Death/KO: 6 frames
- **Palette:** SNES-style 16-bit, using 32–48 colors per sprite, with high contrast and bold outlines
- **Design Notes:**
  - **Sunglasses:** Always on, reflecting light in idle/taunt animations
  - **Beige Jacket:** Prominent red triangle on chest; jacket flares during movement
  - **Gear Variants:** Gloves, bubble guns, and armor are modular (palette swaps or overlay sprites)
  - **Idle Details:** Coop occasionally spins bubble gum or flips sunglasses

#### 2.2. UI & Portraits

- **HUD Portrait:** 64x64 px, animated (e.g., Coop winks or grins when health is full, winces when low)
- **Dialog Portraits:** 128x128 px, with 3–4 facial expressions (neutral, happy, determined, hurt)

#### 2.3. Asset Format

- **Primary:** WebP (for animation frames, transparency supported)
- **Fallback:** PNG (for critical compatibility)
- **Max Sprite Sheet Size:** 512x512 px per sheet

---

### 3. Personality & Narrative Function

#### 3.1. Personality Traits

- **Charismatic, witty, and unflappable**
- Quips regularly during combat and after defeating bosses
- Shows empathy for frightened NPCs in cutscenes
- Occasionally breaks the fourth wall with tongue-in-cheek comments

#### 3.2. Role in Gameplay & Story

- **Narrative Protagonist:** Drives the story forward, uncovering the origins of FUD Monsters
- **Tutorial Guide:** Provides in-game tips via speech bubbles in early levels
- **Comic Relief:** Lightens the tone during tense moments, but can show sincere resolve in boss encounters

---

### 4. Core Stats & Progression

#### 4.1. Base Stats (Level 1, before upgrades)

- **Health (HP):** 100
- **Attack Power:** 10 (base melee), 8 (bubble gun)
- **Movement Speed:** 120 px/s (walk), 180 px/s (run)
- **Jump Height:** 96 px (vertical), with horizontal control
- **Combo Chain:** 3 hits (can be upgraded)
- **Special Meter:** 0–100 (fills via combat actions)
- **Armor:** 0 (can be upgraded)
- **Critical Chance:** 5%

#### 4.2. Stat Progression

- **HP:** +10 per stage (max 200)
- **Attack:** +1–2 per upgrade
- **Movement:** +5% per speed upgrade (max +20%)
- **Combo Chain:** Unlocks up to 5 hits
- **Special Meter:** Upgrades unlock new special moves, faster fill, and unique effects
- **Armor:** Unlocks via gear/armor drops

#### 4.3. Leveling & Upgrades

- **Currency:** Collected from enemy drops; used for skill/equipment upgrades between stages
- **Skill Tree:**
  - **Branch 1:** Melee Combos (new attacks, longer chains, finishers)
  - **Branch 2:** Bubble Gun Mods (spread shot, charged shot, stun bubble)
  - **Branch 3:** Passive Traits (health regen, crit chance, damage resistance)
  - **Branch 4:** Specials (unlock new super moves, e.g. "Bubble Barrage" or “FUD Cleanse”)
- **Gear Unlocks:** Gloves (increase punch damage), Gun Mods (alter bubble behavior), Armor (reduce damage)

---

### 5. Abilities & Controls

#### 5.1. Basic Actions

- **Move Left/Right:** Arrow keys or on-screen D-pad (touch)
- **Jump:** 'Z' or on-screen button (single/double tap for double jump if unlocked)
- **Punch/Kick (Combo):** 'X' or on-screen attack button
- **Bubble Gun:** 'C' or second attack button (touch: secondary attack icon)
- **Special:** 'V' or on-screen special button (when meter full)
- **Dodge/Roll:** Down + Jump or swipe down (if unlocked)
- **Interact:** 'E' or context-sensitive tap

#### 5.2. Combat System

- **Melee Combo:** Fast tap for chain (jab, cross, roundhouse)
- **Launcher:** Up + Attack (uppercut knocks up enemies)
- **Air Attack:** Press attack while airborne for dropkick
- **Bubble Gun:** Fires straight, stuns or damages (depends on upgrade)
- **Special Move:** Powerful AoE or crowd-control ability (unlockable)
- **Environmental Interaction:** Kick barrels, pick up items, activate switches

#### 5.3. Touch & Mouse Support

- **Virtual Buttons:** On-screen for attack, jump, special, movement
- **Gesture Support:** Swipe left/right to dash, swipe up to jump, tap for attack
- **Mouse:** Click for attacks, right-click for special (configurable)

---

### 6. Progression & Customization

#### 6.1. Skills & Combos

- **Unlocks per Stage:**
  - Stage 1: Double Jump
  - Stage 2: Combo Extension (4-hit)
  - Stage 3: Bubble Gun Spread
  - Stage 4: Power Kick
  - Stage 5: Dodge Roll
  - Stage 6: Bubble Gun Charge
  - Stage 7: Health Regen Passive
  - Stage 8: Combo Finisher
  - Stage 9: Special Move 2
  - Stage 10: Final Gear Upgrade

#### 6.2. Equipment & Cosmetics

- **Gloves:** Color and stat variants (e.g., "Knockout Knuckles" +2 damage)
- **Bubble Gun Mods:** Visual and mechanical changes (e.g., "Retro Blaster" = wider bubbles)
- **Jacket & Sunglasses:** Cosmetic swaps and rare themed unlocks (e.g., gold-rimmed shades)

#### 6.3. Lore & Easter Eggs

- **Secret Items:** Unlock dialogue snippets, concept art, and “Coop’s Journal”
- **Cosmetic Unlocks:** Themed after SNES games or in-game lore

---

### 7. Implementation Notes

#### 7.1. Asset Pipeline

- **Sprites packed as texture atlases** (Phaser 3 compatible JSON)
- **Separate layers for base, gear, and effects** for mix-and-match customization
- **Audio:** Chiptune SFX for attacks, jumps, item pickups; short MP3/OGG barks for Coop ("Let’s clean up!", "Not today, FUD!", etc.)

#### 7.2. Performance & Optimization

- **Sprite sheets split by action (idle, walk, attack, etc.)** to minimize RAM usage
- **Compressed asset formats** (WebP preferred)
- **Animation frame reuse and palette swaps** for gear/cosmetic upgrades
- **Touch/mouse/keyboard input** all supported, with responsive UI scaling

#### 7.3. Accessibility

- **Colorblind-friendly palette options** (toggle in settings)
- **Customizable controls**
- **Readable font for all dialog**

---

### 8. Integration & Consistency

- Coop’s design, abilities, and upgrades must be referenced in level design and game design documents.
- All new mechanics (e.g., power-ups, upgrades, skill tree) must align with enemy/boss design and progression as described in existing docs.
- Enemy and boss behaviors should counter or interact with Coop’s skill growth (e.g., bosses immune to bubble stun until upgraded).

---

### 9. Example Sprite Sheet Layout

| Animation      | Frames | Size (px) | Notes                        |
|----------------|--------|-----------|------------------------------|
| Idle           | 4      | 32x48     | Looping, 0.2s per frame      |
| Walk           | 8      | 32x48     | Alternating stride           |
| Attack (Punch) | 6      | 32x48     | Fist blur, strong impact     |
| Bubble Gun     | 6      | 32x48     | Gun recoil, bubble effect    |
| Hurt           | 4      | 32x48     | Flinch, invincibility blink  |
| Special Move   | 10     | 32x48     | Screen shake effect          |

---

### 10. Visual Reference & Inspiration

- **Influences:** Streets of Rage, Final Fight, Scott Pilgrim vs. The World: The Game, River City Girls
- **Moodboard:**  
  - Charismatic SNES protagonists (e.g., Axel from Streets of Rage)
  - 16-bit pixel art with bold outlines, vibrant palettes
  - Stylized attacks with exaggerated impact frames

---

## End of Document
```


---
*Generated on 7/28/2025*
