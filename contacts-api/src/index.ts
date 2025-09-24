// IMPORTANT: Make sure to import `instrument.mjs` at the very top of your file
import '../instrument.mjs';

import type { BaseContext, GraphQLRequestContextDidEncounterErrors } from '@apollo/server';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import express from 'express';
import { resolvers } from './resolvers.js';
import { typeDefs } from './schema.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Add Sentry integration to Apollo Server for GraphQL errors
    plugins: [
      {
        async requestDidStart() {
          return {
            async didEncounterErrors(ctx: GraphQLRequestContextDidEncounterErrors<BaseContext>) {
              // Report GraphQL errors to Sentry
              for (const error of ctx.errors) {
                Sentry.captureException(error);
              }
            },
          };
        },
      },
    ],
  });
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  // Test endpoint to verify Sentry is working
  app.get('/test-error', () => {
    throw new Error('This is a test error for Sentry!');
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Test endpoint to verify Sentry error capturing with intentional error
  app.get('/test-sentry', (req, res) => {
    try {
      // This function doesn't exist and will throw an error
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      foo();
    } catch (e) {
      Sentry.captureException(e);
      res.json({
        message: 'Error captured and sent to Sentry successfully!',
        error: e instanceof Error ? e.message : 'Unknown error',
      });
    }
  });

  // Optional fallback error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(
    (err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      Sentry.captureException(err);
      res.status(500).json({ error: 'Internal Server Error' });
    },
  );

  app.listen(PORT, () => {
    console.log(`GraphQL running at http://localhost:${PORT}/graphql`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  Sentry.captureException(err);
  process.exit(1);
});

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  Sentry.captureException(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(reason);
  process.exit(1);
});
