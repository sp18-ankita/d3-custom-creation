import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { resolvers } from './resolvers.js';
import { typeDefs } from './schema.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`GraphQL running at http://localhost:${PORT}/graphql`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
