const { ApolloServer, gql } = require('apollo-server');

// schema định nghĩa structure của data graph api
const typeDefs = gql`
  # Comment trong graphql string bằng #

  # Schem cần có 2 thứ:
  # 1 là type data
  type Book {
    title: String
    author: String
  }

  # 2 là type Query gồm toàn bộ queries available. Ở đây chỉ có books trả 1 mảng zero hoặc mảng book bên trên
  type Query {
    books: [Book]
  }
`;

// Giả sử đây là database
const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
  },
];

// Resolver định nghĩa từng Query là data đến từ đâu
const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});