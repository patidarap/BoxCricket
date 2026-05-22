# BoxCricket Split - React Native App

A modern production-ready React Native application for managing box cricket matches and splitting expenses.

## 🎯 Features

### Authentication
- ✅ Splash Screen with animations
- ✅ Welcome/Onboarding Screen
- ✅ Phone Login
- ✅ OTP Verification
- ✅ Profile Setup

### Home Dashboard
- ✅ User stats overview
- ✅ Upcoming matches
- ✅ Pending payments
- ✅ Quick actions
- ✅ Pull to refresh

### Match Management
- ✅ Create Match
- ✅ Add Players (Users + Guests)
- ✅ Auto Expense Split Calculation
- ✅ Match Details
- ✅ Payment Status Tracking

### Scoreboard
- ✅ Live scoring UI
- ✅ Team A vs Team B
- ✅ Runs, Wickets, Overs tracking
- ✅ Ball-by-ball updates

### Leaderboard
- ✅ Top performers
- ✅ Runs, Wickets, Matches tabs
- ✅ Player rankings
- ✅ Stats display

### Profile
- ✅ User profile
- ✅ Stats overview
- ✅ Dark mode toggle
- ✅ Settings menu
- ✅ Logout

### Notifications
- ✅ Match reminders
- ✅ Payment reminders
- ✅ Payment success alerts
- ✅ Match updates

## 🏗️ Architecture

### Tech Stack
- React Native CLI
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- Zustand (State Management)
- React Hook Form
- AsyncStorage

### Folder Structure
```
src/
├── assets/
├── components/
│   ├── common/      # Text, Avatar, Container, Spacer
│   ├── cards/       # MatchCard, PlayerCard, StatCard
│   ├── modals/
│   ├── forms/       # Input, DatePicker, Dropdown
│   ├── headers/     # ScreenHeader
│   ├── loaders/     # Skeleton
│   └── buttons/     # PrimaryButton
├── screens/
│   ├── auth/        # Splash, Welcome, Login, OTP, ProfileSetup
│   ├── home/        # HomeScreen
│   ├── matches/     # Create, Details, AddPlayers, ExpenseSplit
│   ├── payments/
│   ├── leaderboard/ # LeaderboardScreen
│   ├── scoreboard/  # ScoreboardScreen
│   ├── profile/     # ProfileScreen
│   └── notifications/ # NotificationsScreen
├── navigation/
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── MatchNavigator.tsx
├── store/           # Zustand stores
├── hooks/           # Custom hooks
├── constants/       # Colors, Typography, Spacing
├── theme/           # Light & Dark themes
├── utils/           # Helpers, Formatters, Validators
├── types/           # TypeScript types
└── data/            # Mock data
```

## 🎨 Design System

### Colors
- Primary: #10B981 (Green)
- Secondary: #3B82F6 (Blue)
- Accent: #F59E0B (Amber)
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

### Typography
- h1: 32px Bold
- h2: 28px Bold
- h3: 24px SemiBold
- h4: 20px SemiBold
- body: 16px Regular
- caption: 12px Regular

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## 📦 Installation

```bash
# Install dependencies
npm install

# iOS only - Install pods
cd ios && bundle exec pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🚀 Features Implemented

### ✅ Completed
- Complete authentication flow
- Home dashboard with stats
- Match creation workflow
- Player management (users + guests)
- Expense split calculation
- Match details view
- Live scoreboard UI
- Leaderboard with rankings
- Profile with stats
- Notifications system
- Dark mode support
- Pull to refresh
- Skeleton loaders
- Empty states

### 🔄 Ready for API Integration
All screens use mock data and are ready to connect to backend APIs:
- Replace mock data imports with API calls
- Add API service layer when needed
- State management already structured for async operations

## 🎯 Key Components

### Reusable Components
- **Text**: Typography component with variants
- **Container**: Screen wrapper with padding options
- **Avatar**: User avatar with initials fallback
- **Spacer**: Consistent spacing
- **Input**: Form input with label and error
- **PrimaryButton**: Button with variants and loading state
- **MatchCard**: Match display card
- **PlayerCard**: Player info card
- **StatCard**: Statistics display
- **ScreenHeader**: Consistent header with navigation
- **Skeleton**: Loading placeholder

### Custom Hooks
- **useTheme**: Theme access and toggle
- **useKeyboard**: Keyboard visibility detection

### State Management (Zustand)
- **authStore**: User authentication
- **matchStore**: Matches data
- **notificationStore**: Notifications
- **themeStore**: Theme preferences

## 🎨 UI Features

- Modern card-based design
- Smooth animations
- Responsive layouts
- Dark mode support
- Consistent spacing
- Professional color scheme
- Icon-based navigation
- Pull to refresh
- Loading states
- Empty states
- Error handling UI

## 📱 Screens

1. **Splash Screen** - Animated app logo
2. **Welcome Screen** - Onboarding with features
3. **Login Screen** - Phone number input
4. **OTP Verification** - 6-digit OTP input
5. **Profile Setup** - Name and avatar
6. **Home Screen** - Dashboard with stats and quick actions
7. **Create Match** - Multi-step match creation
8. **Add Players** - Search and select players
9. **Expense Split** - Auto-calculated split view
10. **Match Details** - Complete match information
11. **Scoreboard** - Live scoring interface
12. **Leaderboard** - Rankings and stats
13. **Profile** - User profile and settings
14. **Notifications** - Alert list

## 🔧 Utils

- **formatters.ts**: Currency, date, time, phone formatting
- **validators.ts**: Input validation functions
- **helpers.ts**: Utility functions
- **storage.ts**: AsyncStorage wrapper

## 📊 Mock Data

- mockMatches.ts
- mockPlayers.ts
- mockLeaderboard.ts
- mockNotifications.ts

## 🎯 Next Steps for Production

1. **Backend Integration**
   - Add API service layer
   - Connect to real endpoints
   - Handle authentication tokens
   - Implement error handling

2. **Payment Integration**
   - Integrate Razorpay/UPI
   - Add payment gateway screens
   - Handle payment callbacks

3. **Enhanced Features**
   - Push notifications
   - Image upload
   - Match history filters
   - Advanced statistics
   - Social sharing

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

5. **Performance**
   - Image optimization
   - List virtualization
   - Code splitting
   - Bundle size optimization

## 📝 Notes

- All screens are fully functional with mock data
- Navigation flow is complete
- State management is production-ready
- UI is polished and responsive
- Dark mode fully supported
- Ready for API integration
- No backend code included (as requested)

## 🎉 Ready to Use

The app is complete and ready to run! Just install dependencies and start developing.

```bash
npm install
npm run android  # or npm run ios
```

Enjoy building your BoxCricket Split app! 🏏
