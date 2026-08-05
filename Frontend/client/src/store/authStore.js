import { create } from 'zustand';
import { api, getToken, setToken, clearToken } from '../api/client';
import { toUserMessage } from '../lib/errors';

const USER_KEY = 'access_user';

function loadUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_KEY);
  }
}

export const useAuthStore = create((set) => ({
  token: getToken(),
  user: loadUser(),
  loading: false,
  error: null,

  async login(email, password) {
    set({ loading: true, error: null });

    try {
      const data = await api.post('/auth/login', { email, password });

      setToken(data.token);
      saveUser(data.user);

      set({
        token: data.token,
        user: data.user,
        loading: false,
        error: null,
      });

      return data.user;
    } catch (err) {
      set({
        loading: false,
        error: toUserMessage(err, 'Could not sign in. Check your email and password.'),
      });
      throw err;
    }
  },

  logout() {
    clearToken();
    saveUser(null);
    set({
      token: null,
      user: null,
      error: null,
      loading: false,
    });
  },

  setUser(user) {
    saveUser(user);
    set({ user });
  },


  async updateTimezone(timezone) {
    set({ loading: true, error: null });

    try {
      const data = await api.patch('/me/timezone', { timezone });
      const nextUser = {
        ...loadUser(),
        ...data.user,
      };

      saveUser(nextUser);
      set({ user: nextUser, loading: false });
      return nextUser;
    } catch (err) {
      set({
        loading: false,
        error: toUserMessage(err, 'Could not update timezone. Please try again.'),
      });
      throw err;
    }
  },
}));