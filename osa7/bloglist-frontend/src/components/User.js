import { useEffect, useState } from 'react';
import userService from '../services/users';
import { useParams } from 'react-router-dom';

const User = () => {
  const id = useParams().id;
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getById(id).then((res) => {
      setUser(res);
      console.log(res);
    });
  }, [id]);

  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>{user.username}</h1>
      <h2>added blogs:</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
