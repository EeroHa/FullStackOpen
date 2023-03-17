import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import CreateBlogForm from './components/CreateBlog';
import blogService from './services/blogs';
import loginService from './services/login';

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="success">{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const successNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const errorNotification = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      blogService.setToken(user.token);
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      errorNotification('wrong username or password');
      console.log(exception);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log('logging out');

    blogService.setToken(null);
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    console.log('creating a blog');

    try {
      await blogService.create(blogObject);

      const allBlogs = await blogService.getAll();
      setBlogs(allBlogs);
      successNotification(
        `a new blog ${blogObject.title} by ${blogObject.author}`
      );
    } catch (exception) {
      errorNotification('blog cannot be created, invalid blog');
      console.log(exception);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const addLike = async (blogObject, id) => {
    try {
      await blogService.update(blogObject, id);

      const allBlogs = await blogService.getAll();
      setBlogs(allBlogs);
    } catch (exception) {
      errorNotification('cannot like blog');
      console.log(exception);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id);

      const allBlogs = await blogService.getAll();
      setBlogs(allBlogs);
    } catch (exception) {
      errorNotification('cannot remove blog');
      console.log(exception);
    }
  };

  console.log(user);

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <p>
        {user.username} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create">
        <CreateBlogForm addBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => {
          return b.likes - a.likes;
        })
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            username={user.username}
          />
        ))}
    </div>
  );
};

export default App;
