# BoxCricket Split - Quick Start

## ✅ Installation Complete!

All dependencies have been installed successfully.

## 🚀 Run the App

Metro bundler is already running. Open a new terminal and run:

### For iOS:
```bash
yarn ios
```

### For Android:
```bash
yarn android
```

## 📱 App Features

### ✅ Implemented Screens:
1. **Splash Screen** - Animated logo
2. **Welcome Screen** - Onboarding
3. **Login Screen** - Phone authentication
4. **OTP Verification** - 6-digit code
5. **Profile Setup** - User details
6. **Home Dashboard** - Stats & quick actions
7. **Create Match** - Match creation flow
8. **Add Players** - User & guest management
9. **Expense Split** - Auto calculation
10. **Match Details** - Complete match info
11. **Scoreboard** - Live scoring
12. **Leaderboard** - Rankings & stats
13. **Profile** - User profile & settings
14. **Notifications** - Alerts & reminders

### 🎨 Features:
- ✅ Dark Mode Support
- ✅ Pull to Refresh
- ✅ Skeleton Loaders
- ✅ Empty States
- ✅ Smooth Animations
- ✅ Type-Safe (TypeScript)
- ✅ State Management (Zustand)
- ✅ Navigation (React Navigation)

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # All app screens
├── navigation/     # Navigation setup
├── store/         # Zustand state management
├── hooks/         # Custom hooks
├── constants/     # App constants
├── theme/         # Theme configuration
├── utils/         # Utility functions
├── types/         # TypeScript types
└── data/          # Mock data
```

## 🎯 Key Components

- **Text** - Typography with variants
- **Container** - Screen wrapper
- **Avatar** - User avatars
- **Input** - Form inputs
- **PrimaryButton** - Buttons with variants
- **MatchCard** - Match display
- **PlayerCard** - Player info
- **StatCard** - Statistics
- **ScreenHeader** - Navigation header
- **Skeleton** - Loading states

## 🔧 Tech Stack

- React Native 0.85.3
- TypeScript
- React Navigation 7
- Zustand (State Management)
- AsyncStorage
- React Hook Form

## 📊 Mock Data

All screens use mock data from:
- `src/data/mockMatches.ts`
- `src/data/mockPlayers.ts`
- `src/data/mockLeaderboard.ts`
- `src/data/mockNotifications.ts`

## 🎨 Design System

**Colors:**
- Primary: #10B981 (Green)
- Secondary: #3B82F6 (Blue)
- Accent: #F59E0B (Amber)

**Typography:**
- h1-h5, body, caption variants

**Spacing:**
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

## 🔄 Ready for API Integration

The app is structured to easily integrate with backend APIs:
1. Replace mock data imports with API calls
2. Add API service layer in `src/services/`
3. Update store actions to handle async operations

## 📝 Notes

- No backend code included (as requested)
- All UI is production-ready
- State management is complete
- Navigation flow is fully functional
- Dark mode fully supported

## 🎉 Enjoy!

Your BoxCricket Split app is ready to use! 🏏

Start developing by modifying files in `src/` directory.
