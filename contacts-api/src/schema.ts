export const typeDefs = /* GraphQL */ `
  scalar Email

  type Contact {
    id: ID!
    name: String!
    email: Email!
    phone: String!
    subject: String!
    message: String!
    consent: Boolean!
  }

  input ContactInput {
    name: String!
    email: Email!
    phone: String!
    subject: String!
    message: String!
    consent: Boolean!
  }

  input ContactsFilter {
    name: String
    email: String
    phone: String
    subject: String
    message: String
    consent: Boolean
  }

  enum SortField {
    name
    email
    phone
    subject
    message
    consent
  }

  enum SortOrder {
    ASC
    DESC
  }

  input ContactsSort {
    field: SortField!
    order: SortOrder!
  }

  input ContactsPagination {
    page: Int! = 1
    limit: Int! = 10
  }

  type ContactsResponse {
    contacts: [Contact!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type Query {
    contacts(
      filter: ContactsFilter
      sort: ContactsSort
      pagination: ContactsPagination
    ): ContactsResponse!
    contact(id: ID!): Contact
  }

  type Mutation {
    addContact(input: ContactInput!): Contact!
    updateContact(id: ID!, input: ContactInput!): Contact!
    deleteContact(id: ID!): Boolean!
  }
`;
