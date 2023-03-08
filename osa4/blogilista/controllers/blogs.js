const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
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

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });
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
