import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import { z } from 'zod';
import * as Store from './store.js';

const emailSchema = z.string().email();
const phoneSchema = z.string().min(3); // adjust to your format rules

const contactInputSchema = z.object({
  name: z.string().min(1),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().min(1),
  message: z.string().min(1),
  consent: z.boolean(),
});

export const resolvers = {
  Email: new GraphQLScalarType({
    name: 'Email',
    description: 'RFC 5322 email string',
    serialize(value: unknown) {
      const s = String(value);
      if (!emailSchema.safeParse(s).success) throw new GraphQLError('Invalid email');
      return s;
    },
    parseValue(value: unknown) {
      const s = String(value);
      if (!emailSchema.safeParse(s).success) throw new GraphQLError('Invalid email');
      return s;
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError('Email must be a string');
      const s = ast.value;
      if (!emailSchema.safeParse(s).success) throw new GraphQLError('Invalid email');
      return s;
    },
  }),
  Query: {
    contacts: (
      _: unknown,
      args: {
        filter?: Store.ContactsFilter;
        sort?: Store.ContactsSort;
        pagination?: Store.ContactsPagination;
      },
    ) => Store.getContactsWithFiltering(args.filter, args.sort, args.pagination),
    contact: (_: unknown, args: { id: string }) => Store.getById(args.id),
  },
  Mutation: {
    addContact: async (_: unknown, args: { input: Store.Contact }) => {
      const parsed = contactInputSchema.parse(args.input);
      return Store.add(parsed);
    },
    updateContact: async (_: unknown, args: { id: string; input: Store.Contact }) => {
      const parsed = contactInputSchema.parse(args.input);
      return Store.update(args.id, parsed);
    },
    deleteContact: async (_: unknown, args: { id: string }) => {
      return Store.remove(args.id);
    },
  },
};
