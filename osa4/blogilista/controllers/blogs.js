const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id).then((blog) => {
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  });
});

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }
  if (user._id.toString() !== blog.user.toString()) {
    return response.status(403).end();
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body, user } = request;

  const blog = new Blog({ ...body, user: user._id });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;
  const id = request.params.id;
  const blog = {
    likes: body.likes,
  };

  const newBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.json(newBlog);
});

module.exports = blogsRouter;
