import { useState, useEffect } from 'react';
import CreateBlogForm from './components/CreateBlog';
import blogService from './services/blogs';
import loginService from './services/login';
import Blogs from './components/Blogs';
import Users from './components/Users';
import User from './components/User';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import Navigation from './components/Navigation';

const ErrorNotification = ({ message }) => {
  return <div>{message && <Alert variant="warning">{message}</Alert>}</div>;
};

const SuccessNotification = ({ message }) => {
  return <div>{message && <Alert variant="success">{message}</Alert>}</div>;
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

  if (user === null) {
    return (
      <div className="container">
        <h2>Login to application</h2>
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successMessage} />
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username</Form.Label>

            <Form.Control
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button variant="success" type="submit">
              login
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }

  return (
    <div className="container">
      <Router>
        <Navigation />
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successMessage} />

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Blogs
                  blogs={blogs}
                  addLike={addLike}
                  deleteBlog={deleteBlog}
                  user={user}
                />
              </div>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route
            path="/create"
            element={<CreateBlogForm addBlog={addBlog} />}
          />
        </Routes>
        <p style={{ float: 'right' }}>
          {user.username} logged in{' '}
          <Button onClick={handleLogout} size="sm" variant="outline-secondary">
            logout
          </Button>
        </p>
      </Router>
    </div>
  );
};

export default App;
