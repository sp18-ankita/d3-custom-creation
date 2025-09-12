#!/usr/bin/env node

async function testAPI() {
  const GRAPHQL_URL = 'http://localhost:4001/graphql';

  async function graphqlRequest(query, variables = {}) {
    try {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
      if (json.errors) {
        console.error('GraphQL errors:', json.errors);
        return null;
      }
      return json.data;
    } catch (error) {
      console.error('Network error:', error);
      return null;
    }
  }

  console.log('Testing API with filters, sorting, and pagination...\n');

  // Test 1: Basic query with pagination
  console.log('1. Testing basic pagination:');
  const basicQuery = `
    query {
      contacts(pagination: { page: 1, limit: 1 }) {
        contacts { id name email }
        total
        page
        limit
        totalPages
      }
    }
  `;
  const basicResult = await graphqlRequest(basicQuery);
  console.log(JSON.stringify(basicResult, null, 2));

  // Test 2: Filtering by name
  console.log('\n2. Testing filter by name (Ankita):');
  const filterQuery = `
    query {
      contacts(filter: { name: "Ankita" }) {
        contacts { id name email }
        total
      }
    }
  `;
  const filterResult = await graphqlRequest(filterQuery);
  console.log(JSON.stringify(filterResult, null, 2));

  // Test 3: Sorting by email DESC
  console.log('\n3. Testing sort by email DESC:');
  const sortQuery = `
    query {
      contacts(sort: { field: email, order: DESC }) {
        contacts { id name email }
        total
      }
    }
  `;
  const sortResult = await graphqlRequest(sortQuery);
  console.log(JSON.stringify(sortResult, null, 2));

  // Test 4: Combined filter, sort, and pagination
  console.log('\n4. Testing combined filter + sort + pagination:');
  const combinedQuery = `
    query {
      contacts(
        filter: { consent: true }
        sort: { field: name, order: ASC }
        pagination: { page: 1, limit: 10 }
      ) {
        contacts { id name email consent }
        total
        page
        totalPages
      }
    }
  `;
  const combinedResult = await graphqlRequest(combinedQuery);
  console.log(JSON.stringify(combinedResult, null, 2));
}

testAPI().catch(console.error);
