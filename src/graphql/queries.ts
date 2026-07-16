import { gql } from "@apollo/client";

// Use the GraphiQL explorer at https://graphqlzero.almansi.me/api to test
// these queries before running them in the app.

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    users {
      data {
        id
        name
        email
        phone
        website
        company {
          name
        }
        address {
          street
          suite
          city
          zipcode
        }
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      website
      company {
        name
      }
      address {
        street
        suite
        city
        zipcode
      }
    }
  }
`;

// GraphQLZero always returns a mocked response for mutations — it does not
// persist data, but the round-trip proves the mutation shape is correct.
export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;
