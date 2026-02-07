# Aurea Focus

<div align="center">

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-Styling-pink?logo=sass&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-purple?logo=reactivex&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-green?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-Public-brightgreen)

</div>

---

## Description

A **premium Pomodoro timer application** built with **Angular 18** to enhance focus and productivity. This personal project was created to practice modern Angular development patterns and serves as a **Progressive Web App (PWA)** for my concentration and work needs.

Features an elegant, luxury-minimalist design with adaptive intelligence, persistent local storage, and a reactive architecture using RxJS for state management.

---

## Features

- **Core Pomodoro Timer**
  - Configurable work sessions (default: 25 minutes)
  - Short breaks (5 minutes) and long breaks (15 minutes)
  - Visual progress ring with smooth animations
  - Start, pause, resume, and reset controls
  - Audio notifications on session completion
- **Smart Productivity Tracking**
  - Daily session counter
  - Total time tracking (weekly)
  - Current streak calculation
  - Adaptive productivity score based on work hours
- **Session Notes**
  - Create notes during sessions with timestamps
  - Persistent storage across sessions
  - Quick delete functionality
- **Intelligent Features**
  - Deep Focus Mode (optional distraction blocker)
  - Auto-start breaks between sessions
  - Smart theme switching (auto dark mode 6 PM - 6 AM)
  - Manual light/dark theme toggle
- **Data Persistence**
  - LocalStorage for settings, statistics, and notes
  - Automatic daily reset at midnight
  - Session history tracking

---

## Technologies

| Technology | Version |
|---|---|
| Angular | 18.0.0 |
| TypeScript | 5.4.0 |
| RxJS | 7.8.0 |
| SCSS | Latest |
| Node.js | 18+ |

---

## Project Structure

```
aurea-focus/
│
├── src/app/
│   ├── components/
│   │   ├── timer/          → Main Pomodoro timer interface
│   │   ├── stats/          → Statistics and metrics display
│   │   ├── notes/          → Session notes management
│   │   └── settings/       → Configuration modal
│   ├── services/
│   │   ├── timer.service.ts         → Timer state management
│   │   ├── statistics.service.ts    → Stats tracking & productivity
│   │   ├── notes.service.ts         → Notes CRUD operations
│   │   ├── theme.service.ts         → Theme switching logic
│   │   └── notification.service.ts  → Visual & audio alerts
│   ├── models/
│   │   ├── timer.model.ts   → Timer interfaces & enums
│   │   ├── stats.model.ts   → Statistics types
│   │   └── note.model.ts    → Note interface
│   ├── app.*      → Root component
│   └── main.ts              → Bootstrap entry point
├── angular.json             → Angular configuration
├── package.json             → Dependencies
└── tsconfig.json            → TypeScript config
```

---

## Architecture

### Reactive State Management

```
Services (State Layer)
    │
    ├── BehaviorSubject<State>    → Hold state
    ├── Observable<State>         → Expose state
    └── Methods                   → Mutate state
         │
         ↓
    Components (UI Layer)
         │
         ├── Subscribe to state
         ├── Display data
         └── Trigger actions
```

### Data Flow Example (Session Completion)

```
TimerService
    │
    ├─→ Timer reaches 0
    ├─→ Emit new state via BehaviorSubject
    │
    ↓
TimerComponent
    │
    ├─→ Detect completion
    ├─→ Call StatisticsService.addSession()
    │
    ↓
StatisticsService
    │
    ├─→ Update stats (sessions, time, productivity)
    ├─→ Emit new stats
    │
    ↓
StatsComponent
    │
    └─→ Display updated statistics
```

---

## Design System

### Color Palette

| Theme | Primary | Accent | Background | Text |
|---|---|---|---|
| Light | `#1a1a1a` | `#d4af37` (Gold) | `#ffffff` | `#1a1a1a` |
| Dark | `#f5f5f5` | `#ffd700` (Light Gold) | `#1a1a1a` | `#f5f5f5` |

### Typography

- **Display Font**: Cormorant Garamond (Serif) - Timer & Headings
- **Body Font**: Montserrat (Sans-serif) - UI Elements

### Key Animations

- **Slide Down**: Header entrance (0.8s cubic-bezier)
- **Fade In Up**: Timer panel (1s cubic-bezier)
- **Fade In Left/Right**: Side panels (1s cubic-bezier)
- **Progress Ring**: Conic gradient transition (1s linear)
- **Logo Rotation**: 60s continuous rotation

---

## Installation & Usage

```bash
# Clone the repository
git clone <repo-url>
cd aurea-focus

# Install dependencies
npm install

# Run development server
npm start

# Open browser
http://localhost:4200

# Build for production
npm run build
```

---

## Configuration

### Default Settings

| Setting | Default Value | Range |
|---|---|---|
| Work Duration | 25 minutes | 1-60 min |
| Short Break | 5 minutes | 1-30 min |
| Long Break | 15 minutes | 1-60 min |
| Sound Enabled | ✅ Yes | Boolean |
| Auto-start Breaks | ❌ No | Boolean |
| Deep Focus Mode | ❌ No | Boolean |

### LocalStorage Keys

| Key | Purpose |
|---|---|
| `aureaFocusSettings` | Timer configuration |
| `aureaFocusStats` | Statistics & history |
| `aureaFocusNotes` | Session notes |
| `aureaFocusTheme` | Theme preference |
| `lastSessionDate` | Streak calculation |

---

## PWA Features

This application is designed to be installable as a **Progressive Web App**:

- Offline-first architecture
- LocalStorage persistence (no backend required)
- Responsive design (mobile & desktop)
- Standalone app experience
- No installation friction

---

## Development Patterns

### Standalone Components

All components use Angular's modern standalone pattern:

```typescript
@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
```

### Service Injection

Services are provided at root level for singleton behavior:

```typescript
@Injectable({
  providedIn: 'root'
})
export class TimerService { }
```

### Reactive Subscriptions

Components subscribe to state changes and clean up properly:

```typescript
ngOnInit() {
  this.subscription = this.service.state$.subscribe(state => {
    // Update component state
  });
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

---

## Key Learnings (Angular Practice)

This project demonstrates:

- ✅ **Standalone Components** (Angular 18+)
- ✅ **Reactive State Management** with RxJS
- ✅ **Service-based Architecture** for reusability
- ✅ **TypeScript Strict Mode** for type safety
- ✅ **SCSS Modular Design** per component
- ✅ **LocalStorage Persistence** without backend
- ✅ **Lifecycle Hooks** (OnInit, OnDestroy)
- ✅ **Two-way Data Binding** with `[(ngModel)]`
- ✅ **Event Handling** and user interactions
- ✅ **Responsive Design** with CSS Grid & Flexbox

---

## Browser Compatibility

| Browser | Version | Status |
|---|---|---|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

---

## Future Enhancements

Potential improvements for learning:

- [ ] Unit tests (Jasmine/Karma)
- [ ] E2E tests (Cypress/Playwright)
- [ ] Service Worker for offline capability
- [ ] Web Push Notifications API
- [ ] i18n internationalization
- [ ] Data export/import (JSON)
- [ ] Cloud sync (Firebase/Supabase)
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Analytics integration
- [ ] Dark mode system preference detection

---

## Screenshots

### Light Theme
- Clean, elegant interface with golden accents
- Animated progress ring
- Real-time statistics

### Dark Theme
- Automatically activates 6 PM - 6 AM
- Warm gold highlights on dark background
- Reduced eye strain for night sessions

---

## Motivation

Created as a **personal learning project** to:

1. Practice modern Angular development (v18+)
2. Explore reactive programming with RxJS
3. Build a production-quality PWA from scratch
4. Solve my own concentration challenges at work
5. Demonstrate clean architecture principles

---

## Acknowledgments

- Design inspired by luxury watchmaking aesthetics
- Pomodoro Technique® by Francesco Cirillo
- Google Fonts: Cormorant Garamond & Montserrat
- Angular team for the fantastic framework

---

*Personal project — public — no restrictive license.*

