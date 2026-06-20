# Diver's Quest 🌊

A 2D underwater adventure and survival RPG built with **Phaser 3** and **TypeScript**. 

Descend into an alien, bioluminescent ocean trench as you manage your oxygen, gather valuable resources, and avoid deep-sea predators.

## 🌟 Features
- **Exploration & Survival:** Manage your Oxygen levels and Suit Integrity while exploring the depths.
- **RPG Progression:** Scan alien flora to gather Research Points (XP). Level up your diver to permanently increase your Max Oxygen and Max Suit Integrity.
- **Fabricator Upgrades:** Use gathered Salvage to purchase upgrades at the Submarine Hub.
- **Procedurally Generated Graphics:** No external image assets required! All textures (diver, enemies, flora, items) are procedurally drawn on the canvas at runtime.
- **Dynamic UI:** Includes an interactive Submarine Hub, in-game Pause menu, and a fully reactive HUD that tracks your progress in real-time.

## 🎮 How to Play

### Controls
- **Movement:** `W A S D` or `Arrow Keys` to swim around.
- **Interactions:** Just swim into objects to interact with them automatically.

### The Mechanics
1. **The Hub:** You start in your Submarine. Use this safe zone to access the **Fabricator Bay** (to buy upgrades) and check your current stats.
2. **The Dive:** Click "Start Dive" to jump into the trench.
3. **Salvage (Yellow Crates):** Collect these to spend at the Fabricator Bay.
4. **Flora (Green Plants):** Swim through these to scan them for XP. Gathering enough XP will level you up and fully restore your stats.
5. **Oxygen Bubbles (Blue Bubbles):** Refill your depleting oxygen meter.
6. **Predators (Red Eels):** Avoid them! They will rapidly drain your Suit Integrity if they catch you.

*If your Oxygen or Suit Integrity hits zero, you will be forced to trigger an emergency extraction back to the Hub.*

## 🛠️ Installation & Setup

This project uses **Vite** as its bundler for lightning-fast hot reloading.

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Running Locally
1. Clone the repository and navigate into the folder.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`. The game will automatically hot-reload anytime you save a file.

## 🏗️ Tech Stack
- **Engine:** [Phaser 3](https://phaser.io/)
- **Language:** TypeScript
- **Bundler:** Vite
