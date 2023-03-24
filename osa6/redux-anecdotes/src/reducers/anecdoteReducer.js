import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdotesAtStart = [];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    appendAnecdote: (state, action) => {
      state.push(action.payload);
    },
    setAnecdotes: (state, action) => {
      console.log(action);
      return action.payload;
    },
    updateAnecdote: (state, action) => {
      const votedAnecdote = action.payload;
      return state.map((anecdote) =>
        anecdote.id !== votedAnecdote.id ? anecdote : votedAnecdote
      );
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdoteObject = asObject(content);
    const newAnecdote = await anecdoteService.add(anecdoteObject);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const addVote = (id) => {
  return async (dispatch) => {
    const anecdoteToVote = await anecdoteService.getById(id);
    console.log(anecdoteToVote);
    const votedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1,
    };
    await anecdoteService.update(id, votedAnecdote);
    dispatch(updateAnecdote(votedAnecdote));
  };
};

export default anecdoteSlice.reducer;
