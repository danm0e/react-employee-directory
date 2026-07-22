export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company: {
    name: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

export {};
