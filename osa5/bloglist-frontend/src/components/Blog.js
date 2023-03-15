import { useState } from 'react';

const Blog = ({ blog, addLike }) => {
  const [showDetails, setShowDetails] = useState(false);

  const showDetailsChange = (event) => {
    event.preventDefault();
    if (showDetails) {
      setShowDetails(false);
      return;
    }
    setShowDetails(true);
  };

  const handleLike = (event) => {
    event.preventDefault();

    const { title, author, url, likes, user } = blog;
    addLike(
      {
        title,
        author,
        url,
        user,
        likes: likes + 1,
      },
      blog.id
    );
  };

  if (showDetails) {
    return (
      <div>
        <p>
          {blog.title} {blog.author}{' '}
          <button onClick={showDetailsChange}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{blog.user.username}</p>
      </div>
    );
  }
  return (
    <div>
      <p>
        {blog.title} {blog.author}{' '}
        <button onClick={showDetailsChange}>view</button>
      </p>
    </div>
  );
};

export default Blog;
