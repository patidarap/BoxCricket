import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@user',
  THEME: '@theme',
  AUTH_TOKEN: '@auth_token',
};

export const storage = {
  async setUser(user: any) {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async getUser() {
    const user = await AsyncStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  async setTheme(theme: 'light' | 'dark') {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  },

  async getTheme() {
    return await AsyncStorage.getItem(KEYS.THEME);
  },

  async setAuthToken(token: string) {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken() {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  },

  async clear() {
    await AsyncStorage.clear();
  },
};
