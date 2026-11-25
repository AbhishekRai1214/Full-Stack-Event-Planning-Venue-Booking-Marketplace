/**
 * Events API Service
 *
 * Communicates with backend event endpoints with rich fallback seed events
 * for offline, mock, and presentation mode.
 */

import api from '@/services/api';

const DEFAULT_MOCK_EVENTS = [
  {
    id: 'evt_1',
    _id: 'evt_1',
    name: 'Ananya & Kabir Grand Royal Wedding',
    eventType: 'wedding',
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    city: 'Jaipur, Rajasthan',
    guestCount: 650,
    estimatedBudget: 4500000,
    status: 'planning',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    venue: {
      id: '1',
      name: 'The Oberoi Rajvilas Palace',
      city: 'Jaipur, Rajasthan',
      startingPrice: 350000,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    },
    checklist: [
      { _id: 't1', id: 't1', title: 'Finalize Royal Banquet Seating Plan', category: 'Venue', isCompleted: true },
      { _id: 't2', id: 't2', title: 'Schedule Pre-Wedding Photoshoot with Studio Lumière', category: 'Photography', isCompleted: true },
      { _id: 't3', id: 't3', title: 'Review 7-Course Rajasthani & Continental Menu', category: 'Catering', isCompleted: false },
      { _id: 't4', id: 't4', title: 'Approve Stage Floral Arch & Lighting Concept', category: 'Decoration', isCompleted: false },
      { _id: 't5', id: 't5', title: 'Sangeet Choreography & DJ Playlist Finalization', category: 'Entertainment', isCompleted: false },
    ],
    notes: 'Bride & Groom arriving 2 days prior for Mehendi ceremony rehearsal. Ensure bridal suite setup at Oberoi.',
  },
  {
    id: 'evt_2',
    _id: 'evt_2',
    name: 'Aarav 1st Birthday Wonder Carnival',
    eventType: 'birthday',
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    city: 'Bandra, Mumbai',
    guestCount: 120,
    estimatedBudget: 250000,
    status: 'confirmed',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    venue: {
      id: '2',
      name: 'Skyline Terrace Banquet & Lawn',
      city: 'Mumbai',
      startingPrice: 180000,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    },
    checklist: [
      { _id: 't21', id: 't21', title: 'Theme Balloon Arch & Mascot Booking', category: 'Decoration', isCompleted: true },
      { _id: 't22', id: 't22', title: 'Order Custom 3-Tier Chocolate Cake', category: 'Catering', isCompleted: true },
      { _id: 't23', id: 't23', title: 'Finalize Kids Magic Show & Game Host', category: 'Entertainment', isCompleted: true },
      { _id: 't24', id: 't24', title: 'Distribute Return Gifts & Goodie Bags', category: 'Gifts', isCompleted: false },
    ],
    notes: 'Kids play zone requires safety soft mats and dedicated attendant.',
  },
];

export const eventsApi = {
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data.data.events;
    } catch (err) {
      console.warn('Backend unavailable, using mock events dataset');
      const stored = localStorage.getItem('venueaura_mock_events');
      return stored ? JSON.parse(stored) : DEFAULT_MOCK_EVENTS;
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data.event;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : DEFAULT_MOCK_EVENTS;
      const found = list.find((e) => (e._id || e.id) === id);
      if (found) return found;
      throw err;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data.data.event;
    } catch (err) {
      console.warn('Backend unavailable, saving event to local store');
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_EVENTS];
      const newEvent = {
        _id: 'evt_' + Date.now(),
        id: 'evt_' + Date.now(),
        ...eventData,
        status: 'planning',
        checklist: [
          { _id: 't_' + Math.random(), title: 'Finalize Guest List & Invitations', category: 'Guests', isCompleted: false },
          { _id: 't_' + Math.random(), title: 'Confirm Venue Booking & Advance Deposit', category: 'Venue', isCompleted: false },
          { _id: 't_' + Math.random(), title: 'Book Photographer & Videographer', category: 'Photography', isCompleted: false },
          { _id: 't_' + Math.random(), title: 'Schedule Menu Tasting with Caterer', category: 'Catering', isCompleted: false },
        ],
        createdAt: new Date().toISOString(),
      };
      list.unshift(newEvent);
      localStorage.setItem('venueaura_mock_events', JSON.stringify(list));
      return newEvent;
    }
  },

  updateEvent: async (id, updateData) => {
    try {
      const response = await api.patch(`/events/${id}`, updateData);
      return response.data.data.event;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_EVENTS];
      const index = list.findIndex((e) => (e._id || e.id) === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...updateData };
        localStorage.setItem('venueaura_mock_events', JSON.stringify(list));
        return list[index];
      }
      throw err;
    }
  },

  deleteEvent: async (id) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_EVENTS];
      const filtered = list.filter((e) => (e._id || e.id) !== id);
      localStorage.setItem('venueaura_mock_events', JSON.stringify(filtered));
      return id;
    }
  },

  addChecklistTask: async (eventId, task) => {
    try {
      const response = await api.post(`/events/${eventId}/tasks`, task);
      return response.data.data.event;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_EVENTS];
      const index = list.findIndex((e) => (e._id || e.id) === eventId);
      if (index !== -1) {
        const newTask = {
          _id: 't_' + Date.now(),
          id: 't_' + Date.now(),
          title: task.title,
          category: task.category || 'General',
          isCompleted: false,
          dueDate: task.dueDate || null,
        };
        list[index].checklist.push(newTask);
        localStorage.setItem('venueaura_mock_events', JSON.stringify(list));
        return list[index];
      }
      throw err;
    }
  },

  toggleChecklistTask: async (eventId, taskId) => {
    try {
      const response = await api.patch(`/events/${eventId}/tasks/${taskId}/toggle`);
      return response.data.data.event;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_EVENTS];
      const index = list.findIndex((e) => (e._id || e.id) === eventId);
      if (index !== -1) {
        const t = list[index].checklist.find((item) => (item._id || item.id) === taskId);
        if (t) t.isCompleted = !t.isCompleted;
        localStorage.setItem('venueaura_mock_events', JSON.stringify(list));
        return list[index];
      }
      throw err;
    }
  },

  deleteChecklistTask: async (eventId, taskId) => {
    try {
      const response = await api.delete(`/events/${eventId}/tasks/${taskId}`);
      return response.data.data.event;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_events');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_MOCK_EVENTS];
      const index = list.findIndex((e) => (e._id || e.id) === eventId);
      if (index !== -1) {
        list[index].checklist = list[index].checklist.filter(
          (item) => (item._id || item.id) !== taskId
        );
        localStorage.setItem('venueaura_mock_events', JSON.stringify(list));
        return list[index];
      }
      throw err;
    }
  },
};

export default eventsApi;
