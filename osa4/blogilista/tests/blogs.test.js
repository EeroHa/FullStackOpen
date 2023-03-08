const listHelper = require('../utils/list_helper');

const blogs = listHelper.initialBlogs;

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('total likes', () => {
  test('when list is empty likes should be 0', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]]);
    expect(result).toBe(6);
  });

  test('test with multiple blogs', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe('most liked', () => {
  test('when list is empty returns undefined', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toEqual(undefined);
  });

  test('when list has only one blog that is returned', () => {
    const result = listHelper.favoriteBlog([blogs[0]]);
    expect(result).toEqual(blogs[0]);
  });

  test('test with multiple blogs', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });

  test('two blogs with same amount of likes return first', () => {
    const result = listHelper.favoriteBlog([blogs[0], blogs[1]]);
    expect(result).toEqual(blogs[0]);
  });
});

describe('most blogs', () => {
  test('when list is empty returns undefined', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toEqual(undefined);
  });

  test('when list has only one blog author of given blog and count 1 is returned', () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    expect(result).toEqual({ author: blogs[0].author, blogs: 1 });
  });

  test('test with multiple blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
  });
});

describe('most likes', () => {
  test('when list is empty returns undefined', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toEqual(undefined);
  });

  test('when list has only one blog author of given blog its likes are returned', () => {
    const result = listHelper.mostLikes([blogs[0]]);
    expect(result).toEqual({ author: blogs[0].author, likes: blogs[0].likes });
  });

  test('test with multiple blogs', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 18 });
  });
});
