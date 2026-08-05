import { create } from 'zustand';
import { api } from '../api/client';
import { toUserMessage } from '../lib/errors';

export const useEventStore = create((set, get) => ({
  events: [],
  users: [],
  loading: false,
  creating: false,
  updating: false,
  error: null,

  async fetchUsers() {
    try {
      const data = await api.get('/users');
      set({ users: data.users || [] });
    } catch (err) {
      set({ error: toUserMessage(err, 'Could not load users.') });
    }
  },

  async fetchEvents() {
    set({ loading: true, error: null });
    try {
      const data = await api.get('/events');
      set({ events: data.events || [], loading: false });
    } catch (err) {
      set({
        loading: false,
        error: toUserMessage(err, 'Could not load events.'),
      });
    }
  },

  async getEvent(eventId) {
    const data = await api.get(`/events/${eventId}`);
    return {
      event: data.event,
      participants: data.participants || [],
    };
  },

  async createEvent(payload) {
    set({ creating: true, error: null });
    try {
      const data = await api.post('/events', payload);
      const created = data.event;
      set({
        creating: false,
        events: [created, ...get().events],
      });
      return created;
    } catch (err) {
      const message = toUserMessage(err, 'Could not create event. Please try again.');
      set({ creating: false });
      err.message = message;
      throw err;
    }
  },

  async updateEvent(eventId, payload) {
    set({ updating: true });
    try {
      const data = await api.put(`/events/${eventId}`, payload);
      const updated = data.event;
      set({
        updating: false,
        events: get().events.map((event) =>
          event.id === eventId ? { ...event, ...updated } : event
        ),
      });
      return updated;
    } catch (err) {
      const message = toUserMessage(err, 'Could not update event. Please try again.');
      set({ updating: false });
      err.message = message;
      throw err;
    }
  },

  async addAttendee(eventId, userId) {
    return api.post(`/events/${eventId}/attendees`, { userId });
  },

  async removeAttendee(eventId, userId) {
    return api.delete(`/events/${eventId}/attendees`, { userId });
  },

  /**
   * Sync attendee list after an organizer updates profiles.
   * Organizer is never removed here.
   */
  async syncAttendees(eventId, nextProfileIds, organizerId) {
    const { participants } = await get().getEvent(eventId);
    const currentAttendeeIds = participants
      .filter((p) => p.userId !== organizerId && p.role !== 'organizer')
      .map((p) => p.userId);

    const desired = [...new Set((nextProfileIds || []).filter((id) => id && id !== organizerId))];
    const toAdd = desired.filter((id) => !currentAttendeeIds.includes(id));
    const toRemove = currentAttendeeIds.filter((id) => !desired.includes(id));

    for (const userId of toAdd) {
      await get().addAttendee(eventId, userId);
    }
    for (const userId of toRemove) {
      await get().removeAttendee(eventId, userId);
    }
  },

  async fetchAuditLogs(eventId) {
    const data = await api.get(`/events/${eventId}/audit`);
    return data.logs || [];
  },

  clearError() {
    set({ error: null });
  },
}));