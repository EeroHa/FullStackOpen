import { useSelector, useDispatch } from 'react-redux';
import { addVote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    var a = [...state.anecdotes];
    if (state.filter !== '') {
      a = a.filter((o) =>
        o.content.toLowerCase().includes(state.filter.toLowerCase())
      );
    }

    return a.sort((a, b) => b.votes - a.votes);
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    console.log('vote', id);
    dispatch(addVote(id));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
