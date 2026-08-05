import { create } from 'zustand';
import { api } from '../api/client';
import { DEFAULT_TIMEZONES, normalizeTimezones } from '../lib/timezones';

export const useMetaStore = create((set, get) => ({
  timezones: DEFAULT_TIMEZONES,
  loadingTimezones: false,
  loadedTimezones: false,

  async fetchTimezones() {
    if (get().loadedTimezones || get().loadingTimezones) return get().timezones;
    set({ loadingTimezones: true });
    try {
      const data = await api.get('/timezones');
      const timezones = normalizeTimezones(data?.timezones);
      set({
        timezones,
        loadingTimezones: false,
        loadedTimezones: true,
      });
      return timezones;
    } catch {
      set({
        loadingTimezones: false,
        loadedTimezones: true,
      });
      return get().timezones;
    }
  },
}));