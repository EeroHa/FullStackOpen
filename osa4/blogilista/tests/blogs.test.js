const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../utils/list_helper');
const app = require('../app');
const Blog = require('../models/blog');
const _ = require('lodash');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are right amount of blogs', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs have an id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('POST /api/blogs', () => {
  test('Blog can be added', async () => {
    const newBlog = {
      author: 'Testi Kirjoittaja',
      likes: '0',
      title: 'Testi',
      url: 'www.testi.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('If new blog has no likes field, it is set to 0', async () => {
    const newBlog = {
      author: 'Testi Kirjoittaja',
      title: 'Testi',
      url: 'www.testi.com',
    };
    const r = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const id = r.body.id;

    const response = await api.get(`/api/blogs/${id}`);

    expect(response.body.likes).toBeDefined();
    expect(response.body.likes === 0);
  });

  test('Try to add new blog without a title', async () => {
    const newBlog = {
      author: 'Testi Kirjoittaja',
      url: 'www.testi.com',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

describe('DELETE /api/blogs/{id}', () => {
  test('Delete a blog', async () => {
    const response = await api.get('/api/blogs');
    const id = response.body[0].id;
    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

describe('PUT /api/blogs/{id}', () => {
  test('Edit a blogs likes', async () => {
    const response = await api.get('/api/blogs');
    const oldBlog = response.body[0];

    const request = {
      likes: 10,
    };

    const expected = {
      id: oldBlog.id,
      author: oldBlog.author,
      title: oldBlog.title,
      url: oldBlog.url,
      likes: request.likes,
    };

    const r = await api
      .put(`/api/blogs/${oldBlog.id}`)
      .send(request)
      .expect(200);

    expect(r.body).toEqual(expected);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
