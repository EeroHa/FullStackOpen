import Blog from './Blog';

const Blogs = ({ blogs, addLike, deleteBlog, user }) => {
  return (
    <div>
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
            class="blog"
          />
        ))}
    </div>
  );
};

export default Blogs;
