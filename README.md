# E-WASTE: THE LAST DEVICE

> **Your Device. Your Decision. Our Planet.**

An immersive, interactive e-waste awareness game built as a college project. Players become **E-Waste Response Officers** in the fictional smart city of **Nova City**, investigating an e-waste crisis through exploration, puzzles, and decision-making.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Lucide React** | Icon library |
| **CSS Variables** | Design system & theming |
| **localStorage** | Game state persistence |
| **Web Fonts** | Inter, JetBrains Mono, Orbitron |

No backend required. Runs entirely in the browser.

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── Navbar.jsx           # Responsive navigation
│   ├── GameHUD.jsx          # Mission HUD (timer, score, metrics)
│   ├── AchievementToast.jsx # Achievement unlock notifications
│   └── LoadingScreen.jsx    # Initial loading with city animation
│
├── pages/
│   ├── Home.jsx             # Landing page with city background
│   ├── Briefing.jsx         # Cinematic mission briefing (typewriter)
│   ├── CityMap.jsx          # Interactive SVG city map
│   ├── TechDistrict.jsx     # Location 1 + Circuit Puzzle
│   ├── ResidentialBlock.jsx # Location 2 + Code & Data Puzzles
│   ├── RepairLab.jsx        # Location 3: Repair vs Replace decisions
│   ├── ScrapYard.jsx        # Location 4: Hazard identification
│   ├── RecyclingCenter.jsx  # Location 5: Sorting game with combos
│   ├── FinalMystery.jsx     # Mystery reveal + Action Plan creator
│   ├── Results.jsx          # Animated impact report + rank
│   ├── Learn.jsx            # Educational content (7 topics)
│   ├── AchievementsPage.jsx # Achievement gallery
│   ├── ImpactDashboard.jsx  # Analytics & charts
│   └── Leaderboard.jsx      # Local high scores
│
├── hooks/
│   ├── useGameState.js      # Central game state management
│   ├── useTimer.js          # Mission countdown timer
│   └── useLocalStorage.js   # Persistent storage hook
│
├── data/
│   ├── devices.js           # 6 device definitions + repair lab
│   ├── locations.js         # 5 city locations
│   ├── achievements.js      # 12 achievements with conditions
│   └── educationalContent.js # 7 topics + 8 real-world actions
│
├── App.jsx                  # Root component with routing
├── main.jsx                 # React entry point
└── index.css                # Complete design system
```

---

## 🎮 Game Features

### Core Gameplay
- **5 Investigation Zones**: Tech District → Residential Block → Repair Lab → Scrap Yard → Recycling Center
- **15-minute mission timer** with Emergency Mode fallback
- **Dynamic consequence system**: every decision changes Eco Impact, Resource Recovery, and City Risk
- **Progressive unlock system**: complete zones to access new ones

### Interaction Types
| Type | Location |
|------|---------|
| Click investigation | All zones |
| Device inspection | Tech District |
| Drag & drop puzzle | Circuit puzzle, Recycling Center |
| Code-breaking | Residential Block |
| Scenario decision | All locations |
| Data wipe mini-game | Residential Block |
| Hazard spotting | Scrap Yard |
| Sorting with combos | Recycling Center |
| Repair vs replace | Repair Lab |
| Action plan builder | Final Mystery |

### Puzzles
1. **The Broken Circuit** (Tech District): Drag-and-drop component sorting
2. **The Recycling Code** (Residential): Symbol-sequence decode puzzle
3. **Data Security** (Residential): Decision + animated secure wipe
4. **Hazard Hunt** (Scrap Yard): Click-to-find 5 hidden violations

### Achievements (12 total)
- First Response, Device Detective, Repair Champion, Data Guardian
- Recycling Master, Hazard Hunter, Circuit Solver, Zero Waste Hero
- E-Waste Hero, Speed Investigator, City Explorer
- 2 secret Easter egg achievements

### Other Features
- **Personalized impact report** with behavioral analysis
- **Local leaderboard** via localStorage
- **Impact Dashboard** with charts and stats
- **Learn section** with 7 educational topics
- **Presentation Mode** for demonstrations
- **Sound ON/OFF** toggle (UI sounds via browser API)
- **Responsive design** for mobile/tablet/desktop
- **Keyboard navigation** and ARIA labels

---

## 📊 Scoring System

| Action | Score |
|--------|-------|
| Correct repair decision | +80-100 pts |
| Correct recycle decision | +70-100 pts |
| Correct reuse decision | +60-80 pts |
| Wrong disposal (garbage) | 0 pts |
| Puzzle solved | +100-200 pts |
| Location bonus | +120-160 pts |
| Easter egg found | +75 pts |
| Action plan submitted | +150-200 pts |

### Ranks
| Score | Rank |
|-------|------|
| 1200+ | 🏆 Nova City E-Waste Hero |
| 900+ | 🌿 Circular Economy Champion |
| 650+ | 🔍 Eco Investigator |
| 400+ | ♻️ Resource Saver |
| 0+ | 🎖️ E-Waste Rookie |

---

## 🌱 E-Waste Awareness Goals

This project addresses e-waste awareness through:

1. **Behavioral modeling** — players experience consequences of poor decisions
2. **Comparative learning** — repair vs replace impact shown side-by-side
3. **Hazard education** — dangerous informal recycling practices visualized
4. **Data security** — interactive data wipe teaches proper device disposal
5. **Material literacy** — device scans show recoverable materials inside electronics
6. **Real-world actions** — personalized post-game recommendations
7. **R-hierarchy** — Repair > Reuse > Recycle messaging throughout

---

## 📱 Responsive Design

- **Desktop** (1024px+): Full two-column layouts, city map with sidebar
- **Tablet** (768-1024px): Adaptive grid, stacked panels
- **Mobile** (<768px): Single column, hamburger nav, touch-friendly targets

---

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎓 Project Information

**Project Name**: E-WASTE: THE LAST DEVICE  
**Category**: Interactive E-Waste Quiz / Digital Escape Room  
**Target Audience**: College students and general citizens  
**Purpose**: Electronic waste awareness through gamified investigation  

---

*"Every device has a second life. Your decisions determine what happens next."*
