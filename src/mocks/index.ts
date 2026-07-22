import { Employee } from "../types";

export const employees: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1-555-123-4567",
    website: "https://alicejohnson.dev",
    company: {
      name: "Acme Technologies",
    },
    address: {
      street: "123 Maple St",
      suite: "Suite 201",
      city: "New York",
      zipcode: "10001",
    },
  },
  {
    id: 2,
    name: "Brian Smith",
    email: "brian.smith@example.com",
    company: {
      name: "Globex Corporation",
    },
  },
  {
    id: 3,
    name: "Carla Martinez",
    email: "carla.martinez@example.com",
    phone: "+1-555-987-6543",
    company: {
      name: "Initech",
    },
    address: {
      street: "456 Oak Ave",
      suite: "Apt 5B",
      city: "Chicago",
      zipcode: "60601",
    },
  },
  {
    id: 4,
    name: "David Lee",
    email: "david.lee@example.com",
    website: "https://davidlee.dev",
    company: {
      name: "Umbrella Solutions",
    },
    address: {
      street: "789 Pine Rd",
      suite: "Floor 3",
      city: "Seattle",
      zipcode: "98101",
    },
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1-555-222-3344",
    website: "https://emmawilson.io",
    company: {
      name: "Wayne Enterprises",
    },
  },
  {
    id: 6,
    name: "Frank Nguyen",
    email: "frank.nguyen@example.com",
    company: {
      name: "Stark Industries",
    },
    address: {
      street: "321 Cedar Blvd",
      suite: "Suite 400",
      city: "Austin",
      zipcode: "73301",
    },
  },
];
