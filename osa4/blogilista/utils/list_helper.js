const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return _.sumBy(blogs, function (b) {
    return b.likes;
  });
};

const favoriteBlog = (blogs) => {
  return _.maxBy(blogs, function (b) {
    return b.likes;
  });
};

const mostBlogs = (blogs) => {
  return _.maxBy(
    _.map(_.groupBy(blogs, 'author'), function (b, key) {
      return { author: key, blogs: _.size(b) };
    }),
    'blogs'
  );
};

const mostLikes = (blogs) => {
  return _.maxBy(
    _.map(_.groupBy(blogs, 'author'), function (b, key) {
      return { author: key, likes: _.sumBy(b, 'likes') };
    }),
    'likes'
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
