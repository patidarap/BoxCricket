import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OTPVerification: {phone: string};
  ProfileSetup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Matches: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

export type MatchStackParamList = {
  CreateMatch: undefined;
  AddPlayers: {matchId: string};
  ExpenseSplit: {matchId: string};
  MatchDetails: {matchId: string};
  PaymentStatus: {matchId: string};
  PaymentMethod: {matchId: string; playerId: string; amount: number};
  Scoreboard: {matchId: string};
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  MatchStack: undefined;
  Notifications: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type MatchStackScreenProps<T extends keyof MatchStackParamList> =
  NativeStackScreenProps<MatchStackParamList, T>;
