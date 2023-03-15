import { useState, useEffect } from 'react';
import Blog from './components/Blog';
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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
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

    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    console.log('creating a blog');

    try {
      await blogService.create({
        title,
        author,
        url,
      });
      successNotification(`a new blog ${title} by ${author}`);

      setAuthor('');
      setTitle('');
      setUrl('');
    } catch (exception) {
      errorNotification('blog cannot be created, invalid blog');
      console.log(exception);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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
      <h2>create a new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          ulr
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
