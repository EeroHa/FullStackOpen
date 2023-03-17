import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('Blog', () => {
  const blog = {
    id: 1,
    title: 'Test Blog 1',
    author: 'Test Author 1',
    url: 'http://testblog1.com',
    likes: 1,
    user: {
      id: 1,
      username: 'user',
      name: 'Test User',
    },
  };
  const addLike = jest.fn();
  const deleteBlog = jest.fn();
  const username = 'user';

  test('renders name and author', () => {
    render(<Blog blog={blog} />);

    screen.getByText(`${blog.title} ${blog.author}`);
  });

  test('clicking view shows more info about blog', () => {
    render(
      <Blog
        blog={blog}
        addLike={addLike}
        deleteBlog={deleteBlog}
        username={username}
      />
    );

    const viewButton = screen.getByText('view');
    fireEvent.click(viewButton);

    screen.getByText(`${blog.title} ${blog.author}`);
    screen.getByText(blog.url);
    screen.getByText(`likes ${blog.likes}`);
    screen.getByText(blog.user.username);
  });

  test('clicking like', () => {
    render(
      <Blog
        blog={blog}
        addLike={addLike}
        deleteBlog={deleteBlog}
        username={username}
      />
    );

    const viewButton = screen.getByText('view');
    fireEvent.click(viewButton);

    const likeButton = screen.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(addLike.mock.calls).toHaveLength(2);
  });
});
