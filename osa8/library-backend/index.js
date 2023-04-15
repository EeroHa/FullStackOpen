const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./models/Book');
const Author = require('./models/Authors');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to database');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
      name: String!,
      born: Int,
      bookCount: Int!
  }

  type Query {
    bookCount: Int,
    authorCount: Int,
    allBooks(genre: String): [Book]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
        title: String!,
        published: Int!,
        author: String!,
        genres: [String!]!
    ): Book!,
    editAuthor(name: String!, setBornTo: Int!): Author
}
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      const { genre } = args;
      if (genre) {
        return Book.find({ genres: { $in: [genre] } }).populate('author');
      }
      return Book.find().populate('author');
    },
    allAuthors: async () => {
      const authors = await Author.find();
      const authorsWithBookCount = await Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author.id });
          return { ...author.toObject(), bookCount };
        })
      );
      return authorsWithBookCount;
    },
  },
  Mutation: {
    addBook: async (_, args) => {
      const author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author });
        try {
          await newAuthor.save();
        } catch (err) {
          throw new GraphQLError('Saving book failed, invalid author', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              err,
            },
          });
        }
      }
      const bookAuthor = await Author.findOne({ name: args.author });
      const book = new Book({ ...args, author: bookAuthor });
      try {
        await book.save();
      } catch (err) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            err,
          },
        });
      }
      return book;
    },
    editAuthor: async (_, args) => {
      const { name, setBornTo } = args;
      const author = await Author.findOne({ name: name });
      author.born = setBornTo;
      try {
        await author.save();
      } catch (err) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: setBornTo,
            err,
          },
        });
      }
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
