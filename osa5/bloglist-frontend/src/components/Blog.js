import { useState } from 'react';
const BlogDetails = ({ blog, showDetailsChange, handleLike }) => {
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
};

const Blog = ({ blog, addLike, deleteBlog, username }) => {
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

  const handleRemove = (event) => {
    event.preventDefault();

    if (window.confirm('Are you sure you want to remove blog?')) {
      deleteBlog(blog.id);
    }
  };

  if (showDetails && blog.user.username === username) {
    return (
      <div>
        <BlogDetails
          blog={blog}
          showDetailsChange={showDetailsChange}
          handleLike={handleLike}
          handleRemove={handleRemove}
        />
        <button onClick={handleRemove}>remove</button>
      </div>
    );
  } else if (showDetails) {
    return (
      <BlogDetails
        blog={blog}
        showDetailsChange={showDetailsChange}
        handleLike={handleLike}
      />
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
