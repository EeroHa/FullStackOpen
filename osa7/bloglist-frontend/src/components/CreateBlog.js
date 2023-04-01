import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const CreateBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    console.log('creating a blog');
    addBlog({ title: title, author: author, url: url });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create a new blog</h2>
      <Form onSubmit={handleCreateBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            id="input-title"
          />

          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            id="input-author"
          />

          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            id="input-url"
          />
        </Form.Group>
        <Button id="submit-blog" type="submit" variant="outline-success">
          create
        </Button>
      </Form>
    </div>
  );
};

export default CreateBlogForm;
