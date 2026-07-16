/**
 * Apollo Client configuration.
 *
 * MICRO FRONTEND INTEGRATION NOTE
 * ─────────────────────────────────
 * The natural seam for MFE extraction in this app is at the EmployeeCard
 * component + Employee type boundary.
 *
 * Architecture:
 *   Host app                          MFE: employee-directory
 *   ─────────────────────────         ─────────────────────────────────────
 *   <EmployeeCard employee={...} />  ← exposes EmployeeCard + Employee type
 *                                      bundles its own apolloClient instance
 *                                      owns all GraphQL fetching logic
 *
 * The host passes an Employee object via props; the MFE owns the GraphQL layer.
 * The src/types/employee.ts interface is the SHARED CONTRACT — it must not
 * break without a major version bump communicated to all consumers.
 *
 * WHY GRAPHQL OVER REST?
 * ─ Strongly-typed schema: the server documents exactly what is available
 * ─ Single endpoint: no proliferation of /users, /users/:id, /users/:id/posts…
 * ─ No overfetching: request only the fields you need
 * ─ Subscriptions: real-time updates are a first-class concept
 *
 * TRADEOFF
 * ─ GraphQL adds tooling complexity (codegen, cache normalisation)
 * ─ REST is easier to cache at the HTTP layer (CDN, browser cache)
 * ─ For small, stable APIs, REST is often the simpler choice
 */

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://graphqlzero.almansi.me/api",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
