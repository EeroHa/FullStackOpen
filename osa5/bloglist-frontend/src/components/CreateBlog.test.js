import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import CreateBlog from './CreateBlog';

describe('CreateBlogForm', () => {
  test('submitting the form calls the addBlog function with the correct arguments', () => {
    const addBlog = jest.fn();
    render(<CreateBlog addBlog={addBlog} />);

    const inputs = screen.getAllByRole('textbox');
    const createButton = screen.getByText('create');

    fireEvent.change(inputs[0], { target: { value: 'Test Blog' } });
    fireEvent.change(inputs[1], { target: { value: 'Test Author' } });
    fireEvent.change(inputs[2], { target: { value: 'http://testblog.com' } });
    fireEvent.click(createButton);

    expect(addBlog).toHaveBeenCalledWith({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
    });
  });
});
