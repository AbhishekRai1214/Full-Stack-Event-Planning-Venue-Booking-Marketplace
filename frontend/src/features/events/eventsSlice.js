/**
 * Events Slice – Redux Toolkit
 *
 * Manages event list, selected event, loading states, and async operations.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventsApi from './eventsApi';

const initialState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { rejectWithValue }) => {
  try {
    return await eventsApi.getEvents();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load events');
  }
});

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id, { rejectWithValue }) => {
  try {
    return await eventsApi.getEventById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load event details');
  }
});

export const createNewEvent = createAsyncThunk('events/createNewEvent', async (eventData, { rejectWithValue }) => {
  try {
    return await eventsApi.createEvent(eventData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create event');
  }
});

export const updateExistingEvent = createAsyncThunk('events/updateExistingEvent', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await eventsApi.updateEvent(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update event');
  }
});

export const removeEvent = createAsyncThunk('events/removeEvent', async (id, { rejectWithValue }) => {
  try {
    return await eventsApi.deleteEvent(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete event');
  }
});

export const toggleTask = createAsyncThunk('events/toggleTask', async ({ eventId, taskId }, { rejectWithValue }) => {
  try {
    return await eventsApi.toggleChecklistTask(eventId, taskId);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update task');
  }
});

export const addTask = createAsyncThunk('events/addTask', async ({ eventId, task }, { rejectWithValue }) => {
  try {
    return await eventsApi.addChecklistTask(eventId, task);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add task');
  }
});

export const removeTask = createAsyncThunk('events/removeTask', async ({ eventId, taskId }, { rejectWithValue }) => {
  try {
    return await eventsApi.deleteChecklistTask(eventId, taskId);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to remove task');
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchEventById
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createNewEvent
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      // updateExistingEvent
      .addCase(updateExistingEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => (e._id || e.id) === (action.payload._id || action.payload.id));
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent && (state.currentEvent._id || state.currentEvent.id) === (action.payload._id || action.payload.id)) {
          state.currentEvent = action.payload;
        }
      })
      // removeEvent
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => (e._id || e.id) !== action.payload);
        if (state.currentEvent && (state.currentEvent._id || state.currentEvent.id) === action.payload) {
          state.currentEvent = null;
        }
      })
      // toggleTask / addTask / removeTask updates currentEvent
      .addCase(toggleTask.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
        const index = state.events.findIndex((e) => (e._id || e.id) === (action.payload._id || action.payload.id));
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
        const index = state.events.findIndex((e) => (e._id || e.id) === (action.payload._id || action.payload.id));
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
        const index = state.events.findIndex((e) => (e._id || e.id) === (action.payload._id || action.payload.id));
        if (index !== -1) state.events[index] = action.payload;
      });
  },
});

export const { clearCurrentEvent } = eventsSlice.actions;

export const selectAllEvents = (state) => state.events.events;
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectEventsLoading = (state) => state.events.isLoading;
export const selectEventsError = (state) => state.events.error;

export default eventsSlice.reducer;
