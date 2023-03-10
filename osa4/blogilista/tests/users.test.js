const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('../utils/list_helper');
const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');

const usersUrl = '/api/users';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('DELETE /api/users/:id', () => {
  test('Delete user', async () => {
    const response = await api.get(usersUrl);

    const id = response.body[0].id;

    await api.delete(`${usersUrl}/${id}`).expect(204);
  });
});

describe('GET /api/users', () => {
  test('Get users succeeds, returns json and correct users', async () => {
    const response = await api
      .get(usersUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].username).toEqual('root');
  });
});

describe('POST /api/users : when there is initially one user at db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post(usersUrl)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('try to create user with invalid username or password', async () => {
    const usersAtStart = await helper.usersInDb();

    const invalidUsers = [
      {
        password: 'salainen',
        expectedError: 'Path `username` is required.',
      },
      {
        username: 'l',
        password: 'salainen',
        expectedError:
          'Path `username` (`l`) is shorter than the minimum allowed length (3).',
      },
      {
        username: 'root',
        password: 'salainen',
        expectedError: 'expected `username` to be unique',
      },
      {
        username: 'newUser',
        expectedError: 'Path `password` is required.',
      },
      {
        username: 'newUser',
        password: 's',
        expectedError:
          'Path `password` (`l`) is shorter than the minimum allowed length (3).',
      },
    ];

    const promises = invalidUsers.map((user) =>
      api
        .post(usersUrl)
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    );

    const responses = await Promise.all(promises);
    responses.forEach((response, index) => {
      expect(response.body.error).toContain(invalidUsers[index].expectedError);
    });

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
